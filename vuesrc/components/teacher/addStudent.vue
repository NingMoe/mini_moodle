<template>
    <div>
        <h2 class="panel-title">Student Management</h2>
        <form>
            <transition-group name="popup" tag="div">
                <div v-for="(item, index) in studentList" class="add-item" :key="item">
                    <div class="input-group">
                        <label><span>student id: </span><input type="text" v-model="studentList[index].id"></label>
                        <label><span>student password: </span><input type="text" v-model="studentList[index].pw"></label>
                        <label><span>student first name: </span><input type="text" v-model="studentList[index].fname"></label>
                        <label><span>student last name: </span><input type="text" v-model="studentList[index].lname"></label>
                    </div>

                    <div class="btn-group">
                        <button @click.prevent="addEntry" class="add-btn">add</button>
                        <button @click.prevent="delEntry(index)" class="del-btn">delete</button>

                    </div>
                </div>
            </transition-group>
            <input type="submit" value="create" @click.prevent="checkCreate" id="create-stu-btn">
        </form>
        <transition name="popup">
            <div class="popup-panel" v-if="isSucCreated">{{info}}</div>
        </transition>

    </div>
</template>
<style lang="sass">
    @import './_subglobal.scss';


    #create-stu-btn{
        @extend .btn;
        width: 20%;
    }

</style>
<script>
    import request from '../../api/ajaxReq';

    export default {
        data:function(){
            return {
                cnt:1,
                studentList:[ {
                    id:0,
                    pw:'',
                    fname:'',
                    lname:''
                }],
                info:'',
                isSucCreated: false,
            }
        },
        methods:{
            delEntry(idx){
                if(this.studentList.length == 1){
                    this.popPanel('Please add at least two students');
                }else{
                    this.studentList.splice(idx, 1);
                }            },
            popPanel(mes){
                var that = this;
                that.info = mes;
                that.isSucCreated = true;
                setTimeout(function(){
                    that.isSucCreated = false;
                },1500);
            },
            checkLastEntry(){
                var that = this;
                var lastItem = this.studentList[this.studentList.length - 1];
                if(lastItem.id == 0 || lastItem.pw == '' || lastItem.fname == '' || lastItem.lname == ''){

                    return Promise.reject('Incomplete Infomation');
                }else{
                    var op = {
                        method:'get',
                        path:'getList',
                        args:{
                            type:'Student',
                            signedID:lastItem.id
                        }
                    };
                    return request(op);

                }
            },
            addEntry(){
                var that = this;

                that.checkLastEntry().then(function(x){
                    var data = JSON.parse(x.responseText);
                    if(data.length){
                        that.popPanel('Student ID exits. Please input a new ID.');
                    }else{
                        that.cnt++;
                        var newStu = {
                            id:0,
                            pw:'',
                            fname:'',
                            lname:''
                        }
                        that.studentList.push(newStu);
                    }
                },function(err){
                    that.popPanel(err);
                }).catch(function(err){
                    console.log(err.responseText);
                })

            },
            checkCreate: async function(){
                var that = this;
                that.checkLastEntry().then(function(x){
                    var data = JSON.parse(x.responseText);
                    if(data.length){
                        that.popPanel('Student ID exits. Please input a new ID.');
                    }else{
                        var argsArr = [];
                        for(let item of that.studentList){
                            var newItem = {
                                id:item.id,
                                pw:item.pw,
                                fname:item.fname,
                                lname:item.lname
                            }
                            argsArr.push(newItem);
                        }
                        var option = {
                            method:'post',
                            path:'/addStudent',
                            args:{
                                stuList: argsArr
                            }
                        }
                        request(option).then(function(xhr){
                            that.info = "successfully created students";
                            that.cnt = 1;
                            that.studentList = [ {
                                id:0,
                                pw:'',
                                fname:'',
                                lname:''
                            }]
                            that.isSucCreated = true;
                            setTimeout(function(){
                                that.isSucCreated = false;
                            },1500);
                        }).catch(function(xhr){
                            console.log(xhr);
                            that.popPanel(xhr.responseText);

                        })
                    }

                },function(err){
                    that.popPanel(err);
                }).catch(function(err){
                    console.log(err.responseText)
                });

            }
        }
    }
</script>