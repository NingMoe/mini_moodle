var express = require('express');
var router = express.Router();

var sql = require('mssql');

var config = require('../dbconfig');

router.post('/check', function(req, res, next){

  var id = req.body.id;
  var password = req.body.password;
  var type = req.body.type;

  console.log(config.password);

  var table;
  if(type == 'student'){
    table = 'Student';
  }else{
    table='Teacher'
  }
  //res.send(req.body);
  var connection = new sql.Connection(config);
  connection.connect().then(function(){
    var req = new sql.Request(connection);
    req.input("id", id)
        .query(`SELECT * FROM ${table} WHERE id=@id`).then(function(recordset){
          if(recordset.length){
            var data = recordset[0];
            if(data.pw == password){
              res.status(200).send(recordset[0]);
              connection.close();

            }else{
              res.status(404).send('password not correct');
              connection.close();
            }
          }else{
            res.status(404).send('account does not exist');
            connection.close();
          }
        })
  })

})


router.get('/getList',function(req, res, body){
  var type = req.query.type;
  var signedID = req.query.signedID;
  var pure = req.query.pure;

  var qs = `SELECT * FROM ${type}`;
  if(signedID ){
    if(type == 'Course')
      if(pure) qs += ` WHERE id = ${signedID}`;
      else qs += ` WHERE tid = ${signedID}`;
    else if(type == 'Student' || type == 'Assignment')
      qs += ` WHERE id = ${signedID}`;

  }
  doConnect(res, qs);
})
router.get('/getStuCourse',function(req,res, body){
  var sid = req.query.sid;
  var query = `SELECT * 
              FROM CourseInfo AS CI 
              JOIN Course AS C
              ON CI.cid = C.id
              WHERE CI.sid = ${sid}`;

  doConnect(res, query);

})
router.post('/updateAnswer', function(req,res, body){
  var aid = req.body.aid;
  var sid = req.body.sid;
  var qs = `UPDATE StuAssignment SET `;
  for(let i = 1; i <=5; i++){
    var ans = req.body[`Q${i}_answer`];
    qs += `Q${i}_answer = \'`+ans+`\'`;
    qs+=','
  }
  qs+=` isSubmitted = 1 WHERE aid = ${aid} AND sid = ${sid}`;

  doConnect(res, qs);

})
router.get('/getStuAsmInfo',function(req, res, body){
  var cid = req.query.cid;
  var sid = req.query.sid;

  var query = `SELECT *
               FROM CourseInfo AS CI
               JOIN Assignment AS A
               ON CI.cid = A.cid
               JOIN StuAssignment AS SA
               ON A.id = SA.aid AND SA.sid = ${sid}
               WHERE CI.cid = ${cid} AND CI.sid = ${sid}`

  doConnect(res, query);
})
router.get('/getStuAsm',function(req, res, body){

  var aid = req.query.aid;
  var qs = `SELECT * FROM StuAssignment AS SA 
              JOIN Student AS S 
              ON SA.sid = S.id 
              JOIN Assignment AS A
              ON A.id = SA.aid
              WHERE SA.isSubmitted = 1 AND SA.aid = ${aid}`

  doConnect(res, qs);
})
router.get('/getAList',function(req, res, body){
  var cid = req.query.cid;
  var qs = `SELECT id, aname FROM Assignment WHERE cid=\'${cid}\'`;
  doConnect(res, qs);
})

//no
router.post('/createCourse', function(req, res, body){
  var data = req.body.course;

  var courses = [];
  var courseInfo = []
  for(let item of data){
    var cid = item.id;
    let k = '(';
    k+=`${item.id},`;
    k+=`\'${item.cname}\',`
    k+=`${item.tid})`
    courses.push(k);

    for(let i of item.stuList){
      let j = '(';
      j += `${i},`;
      j += `${cid})`;
      courseInfo.push(j);
    }
  }

  var courseValue = courses.join(',');
  var courseInfoValue = courseInfo.join(',');

  var connection = new sql.Connection(config);

  connection.connect().then(function() {
    var req = new sql.Request(connection);
    req.query(`INSERT Course VALUES ${courseValue}`).then(function (recordset) {
      return req.query(`INSERT CourseInfo VALUES ${courseInfoValue}`)
    }).then(function (recordset) {
      res.status(200).send(`successful`);
      connection.close();
    }).catch(function (err) {
      res.status(404).send(err + courseInfoValue);
      connection.close();
    })
  })


})
router.post('/updateScore',function(req, res, next){
  var data = req.body;
  var qs = `UPDATE StuAssignment
            SET comment = \'${data.comment}\', marked = ${data.marked}, Q1_score = ${data.Q1_score},Q2_score = ${data.Q2_score},
            Q3_score = ${data.Q3_score},Q4_score = ${data.Q4_score},Q5_score = ${data.Q5_score}, final = ${data.final}
            WHERE aid = ${data.aid} AND sid=${data.sid}`;

  doConnect(res, qs);
})
router.post('/createAssignment',function(req, res, next){
  var data = req.body;
  var qs = `(${data.id},\'${data.aname}\',${data.cid},\'${data.Q1_title}\',${data.Q1_weight},\'${data.Q2_title}\',${data.Q2_weight},\'${data.Q3_title}\',${data.Q3_weight},\'${data.Q4_title}\',${data.Q4_weight},\'${data.Q5_title}\',${data.Q5_weight})`;
  var connection = new sql.Connection(config);
  var aid = data.id;
  connection.connect().then(function() {
    var req = new sql.Request(connection);
    req.query(`INSERT Assignment VALUES ${qs}`).then(function (recordset) {

      return req.query(`SELECT sid FROM CourseInfo WHERE cid = ${data.cid}`);


    }).then(function(recordset){
      var asqs = '';

      for(let i = 0; i < recordset.length; i++){
        let item = recordset[i];
        asqs += '(' + item.sid + ',' + aid +')';//(sid, aid),
        if(i != recordset.length - 1){
          asqs += ',';
        }
      }

      return req.query(`INSERT StuAssignment (sid, aid) VALUES ${asqs}`);
    }).then(function(recordset){
      res.status(200).send(`successful`);
      connection.close();
    }).catch(function (err) {
      res.status(404).send(err);
      connection.close();
    })
  })
})
router.post('/addStudent',function(req, res, next){
  var list = req.body.stuList;
  var values = [];
  for(let i = 0; i < list.length; i++){
    let item = list[i];
    let value = '(';
    value += item.id + ',';
    value += `\'${item.pw}\',`;
    value += `\'${item.fname}\',`;
    value += `\'${item.lname}\')`;
    values.push(value);
  }
  var value = values.join(',');

  var connection = new sql.Connection(config);
  connection.connect().then(function(){
    var req = new sql.Request(connection);
    req.query(`INSERT Student VALUES ${value}`).then(function(recordset){
      res.status(200).send(recordset);
      connection.close();
    }).catch(function(err){
      res.status(404).send(err);
    })
  })

})

module.exports = router;

function doConnect(res, qs){
  var connection = new sql.Connection(config);
  connection.connect().then(function(){
    var request = new sql.Request(connection);
    request.query(qs).then(function(recordset){
      res.status(200).send(recordset);
      connection.close();
    }).catch(function(err){
      res.status(404).send(err);
    })
  })
}