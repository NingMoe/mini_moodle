<template>
    <div  class="asm-panel">
        <slot name="btn"></slot>
        <h3 class="panel-title">Mark Assignment</h3>
        <div class="asm-container">
            <div class="asm-group">
                <span>Please select a course:</span>
                <select v-model="selectedCrs" @change="showAsm">
                    <option :value="{id:crs.id, cname:crs.cname, idx:idx}" v-for="(crs, idx) in courseList">{{crs.cname}}</option>
                </select>
            </div>


            <div v-if="isAsm" class="asm-group">

                <span>Please select an assignment:</span>
                <select v-model="selectedAsm" @change="getStuAsm">
                    <option :value="{id: asm.id, aname:asm.aname}" v-for="asm in courseList[selectedCrs.idx].assignmentList">{{asm.aname}}</option>
                </select>

            </div>

        </div>


        <div v-if="isAnsList"  class="stu-asm-list">
            <div v-for="(post, idx) in stuAsmList">
                <div class="sa-info">
                    <h4 class="sa-info-name">{{post.fname}} {{post.lname}}</h4>
                    <div>
                        <span class="mark-tag" v-if="post.isMarked">marked</span><button class="sa-info-btn" @click="toggle(post)">{{post.btnMes}}</button>
                    </div>
                </div>
                <div  v-if="post.expand" class="mark-area">
                    <div v-for="(ans, title, x) in post.ansList" class="mark-group">
                        <span>{{title}}: {{ans.answer}}</span><input type="number" v-model="ans.score">
                    </div>
                    <div class="mark-group">
                        <span>comment:</span>
                        <textarea cols="30" rows="10" v-model="post.comment"></textarea>
                    </div>

                    <button @click="completeMarking(post);" class="public-btn">complete</button>
                </div>

            </div>
            <div v-if="stuAsmList.length == 0">
                no assignment submitted
            </div>
        </div>

        <transition name="popup">
            <div v-if="isPop" class="popup-panel">
                {{info}}
            </div>
        </transition>


    </div>
</template>
<style lang="sass">
    @import './_subglobal.scss';
    .stu-asm-list{
        width: 100%;
    }
    .asm-container{
        width: 100%;
    }
    .mark-area{
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;

    }
    .public-btn{
        align-self: center;
    }
    .mark-group{
        width: 100%;
        margin: 6px 0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;

    span{
        width: 30%;
        text-align: right;
        margin-right: 12px;

    }
    input, select,textarea{
        width: 40%;
        padding: 0 6px;
        border: 1px solid $gColor;
        color: $gColor;
        border-radius: 4px;
        box-sizing: border-box;
        line-height:1.5;
    &:focus{
         outline: none;
     }
    }
    input, select{
        line-height: 2em;
    }

    }
    .sa-info{
        width: 80%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        &-name{
            color:$gColor;
             width: 37.5%;
            text-align: right;
         }
         &-tag{
            @include tag($markedColor);
            width: auto;
            margin-right: 6px;
          }
          &-btn{
                @extend .btn;
           }
    }
    .asm-group{
        justify-content: flex-start;
        vertical-align:middle;
        span{
            width: 30%;
            line-height: 1.5;
            text-align: right;
            margin-right: 12px;
        }
        input, select{
            width: 40%;
            line-height: 1.5;
            height: 1.5em;
        }

    }

</style>
<script>

    import request from '../../api/ajaxReq';
    import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';


    export default {
        computed:{
                ...mapState([
                        'signedID'
                ])
        },
        data:function(){
            return {
                courseList:[],
                selectedCrs:{
                    id:0,
                    idx:0,
                    cname:''
                },
                selectedAsm:{
                    id:0,
                    aname:''
                },
                stuAsmList:[],
                isAsm:false,
                isAnsList:false,
                isPop:false,
                info:''
            }
        },
        created(){
          this.getCourseList();
        },
        methods:{
            popPanel(mes){
                var that = this;
                that.info = mes;
                that.isPop = true;
                setTimeout(function(){
                    that.isPop = false;
                },1500);
            },
            toggle(post){
                post.expand = !post.expand;
                post.btnMes = (post.btnMes == 'detail')?'brief':'detail';
            },
            completeMarking(post){
                var that = this;
                var option = {
                    method:'post',
                    path:'updateScore',
                    args:{
                        aid:that.selectedAsm.id,
                        sid:post.sid,
                        comment:post.comment,
                        marked:1
                    }
                }
                var finalScore = 0;
                var totalWeight = 0;
                for(let [key, value] of Object.entries(post.ansList)){
                    option.args[`${key}_score`] = value.score;
                    finalScore += value.score * value.weight;
                    totalWeight += value.weight;
                }

                finalScore /= totalWeight;

                option.args.final = finalScore;

                request(option).then(function(xhr){
                    var data = xhr.responseText;
                    console.log('successful');
                    post.expand = false;
                    that.popPanel('Successfully marked.');
                }).catch(function(err){
                    console.log(err.responseText);
                })
            },
            showAsm(){
                this.isAsm = true;
            },
            getStuAsm(){
              var that = this;
                that.info = 'getting data...';
                that.isAnsList = false;
                that.stuAsmList = [];
                var option = {
                    method:'get',
                    path:'getStuAsm',
                    args:{
                        aid:that.selectedAsm.id
                    }

                }

                request(option).then(function(xhr){
                    var data = JSON.parse(xhr.responseText);

                    for(let item of data){
                        var info = {
                            sid: item.sid,
                            fname:item.fname,
                            lname:item.lname,
                            comment:'',
                            ansList:{},
                            expand:false,
                            btnMes:'detail',
                            isMarked:(item.marked == 1)?true:false

                        }

                        for(let i = 1; i <= 5; i++){
                            info.ansList[`Q${i}`]={
                                answer: item[`Q${i}_answer`],
                                score:0,
                                weight: item[`Q${i}_weight`]
                            }
                        }
                        that.stuAsmList.push(info);

                    }
                    that.info = '';
                    that.isAnsList = true;
                }).catch(function(err){
                    that.info = 'error on getting student assignment posts: ' + err.responseText;
                })
            },
            getCourseList(){
                var that = this;
                var option = {
                    method:'get',
                    path:'getList',
                    args:{
                        type:'Course',
                        signedID:that.signedID

                    }
                };
                request(option).then(function(xhr){
                    var list = JSON.parse(xhr.responseText);
                    fetch();
                    async function fetch(){
                        for(let item of list){
                            let op = {
                                method:'get',
                                path:'getAList',
                                args:{
                                    cid : item.id
                                }
                            }
                            await request(op).then(function(x){
                                var alist = JSON.parse(x.responseText);
                                var arr = [];
                                for(let a of alist){
                                    arr.push({
                                        id:a.id,
                                        aname:a.aname
                                    })
                                }
                                that.courseList.push({
                                    id:item.id,
                                    tid:item.tid,
                                    cname:item.cname,
                                    assignmentList:arr
                                });

                            })

                        }
                    }
                }).catch(function(err){
                    console.log(err.responseText);
                })
            }

        }
    }
</script>