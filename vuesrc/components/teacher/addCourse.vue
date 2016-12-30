<template>
    <div>
        <h2 class="panel-title">Course Management</h2>
        <form>
            <transition-group name="popup" tag="div">
                <div v-for="(item, index) in courseList" :key="item" class="add-item">
                    <div class="input-group">
                        <label><span>course id:</span><input type="text" v-model="courseList[index].id"></label>
                        <label><span>course name:</span><input type="text" v-model="courseList[index].cname"></label>
                        <label>
                            <span>select students:</span>
                            <select v-model="courseList[index].studentList" multiple>
                                <option v-for="i in stuList" :value="i.id" >
                                    {{i.id}} -- {{i.fname}} {{i.lname}}
                                </option>
                            </select>
                        </label>
                    </div>
                    <div class="btn-group">
                        <button @click.prevent="addEntry" class="add-btn">add</button>
                        <button @click.prevent="delEntry(index)" class="del-btn">delete</button>
                    </div>

                </div>
            </transition-group>

            <input type="submit" value="create" @click.prevent="checkCreate" id="create-btn">
        </form>
        <transition name="popup">
            <div v-if="isPop" class="popup-panel">{{info}}</div>
        </transition>

    </div>
</template>
<style lang="sass">
    @import './_subglobal.scss';

    #create-btn{
        @extend .btn;
        width: 20%;
    }

</style>
<script>
    import request from '../../api/ajaxReq';
    import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';

    export default {
        data:function(){
            return {
                cnt : 1,
                courseList:[{
                    id:0,
                    cname:'',
                    studentList:[],
                    }],
                stuList:[],
                info:'',
                isPop:false
            }
        },
        created:function(){
            this.getStuList();
        },
        computed:{
                ...mapState([
                        'signedID'
                ])
        },
        methods:{
            delEntry(idx){
                if(this.courseList.length == 1){
                    this.popPanel('Please add at least two courses');
                }else{
                    this.courseList.splice(idx, 1);
                }
            },
            popPanel(mes){
                var that = this;
                that.info = mes;
                that.isPop = true;
                setTimeout(function(){
                    that.isPop = false;
                },1500);
            },
            getStuList(){
                var that = this;
                var option = {
                    method:'get',
                    path:'/getList',
                    args:{
                        type:'Student'
                    }
                }
                request(option).then(function(xhr){
                    var list = JSON.parse(xhr.responseText);
                    for(let item of list){
                        that.stuList.push({
                            id:item.id,
                            fname:item.fname,
                            lname:item.lname
                        });
                    }
                    //console.log(that.stuList.length);
                }).catch(function(err){
                    console.log(err.responseText);
                    that.popPanel(err.responseText);
                })
            },

            checkLastEntry(){
                var that = this;
                var lastItem = that.courseList[that.courseList.length - 1];
                if(lastItem.id == 0 || lastItem.pw == '' || lastItem.fname == '' || lastItem.lname == ''){

                    return Promise.reject('Incomplete Infomation');
                }else{
                    var op = {
                        method:'get',
                        path:'getList',
                        args:{
                            type:'Course',
                            pure:true,
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
                        that.popPanel('Course ID exits. Please input a new ID.');
                    }else{
                        that.cnt++;
                        var newItem = {
                            id:0,
                            cname:'',
                            studentList:[],
                        };
                        that.courseList.push(newItem);
                    }

                }).catch(function(err){

                    that.popPanel(err);
                })
            },
            checkCreate(){

                var that = this;

                that.checkLastEntry().then(function(x){
                    var data = JSON.parse(x.responseText);
                    if(data.length){
                        that.popPanel('Course ID exits. Please input a new ID.');
                    }else{
                        var argsArr = [];
                        for(let i = 0; i < that.courseList.length; i++){
                            let c = that.courseList[i];
                            let newCourse = {
                                id:c.id,
                                cname:c.cname,
                                tid:that.signedID,
                                stuList:c.studentList
                            }
                            argsArr.push(newCourse);
                        }
                        console.log(argsArr);
                        var option = {
                            method:'post',
                            path:'createCourse',
                            args:{
                                course:argsArr
                            }
                        };

                        request(option).then(function(xhr){
                            that.popPanel(xhr.responseText);
                            that.cnt = 1;
                            that.courseList = [{
                                id:0,
                                cname:'',
                                studentList:[],
                            }]
                        }).catch(function(err){
                            that.popPanel(err.responseText);
                        })
                    }
                },function(err){
                    that.popPanel(err);
                }).catch(function(err){
                    that.popPanel(err.responseText);
                })

            }
        }
    }
</script>