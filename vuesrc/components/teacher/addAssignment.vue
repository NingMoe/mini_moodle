<template>
    <div>
        <h2 class="panel-title">Assignment Management</h2>
        <button @click="addAssignment" class="asm-btn">add assignment</button>
        <button @click="isMarkedAssignment = true" class="asm-btn">mark assignment</button>


        <div v-for="(crs, index) in courseList" class="crs-item">
            <span class="crs-item-id">{{crs.id}}</span> | <span class="crs-item-cname">{{crs.cname}}</span>
            <div v-for="a in crs.assignmentList" class="asm-item">
                <span class="asm-item-id">{{a.id}}</span> - <span class="asm-item-aname">{{a.aname}}</span>
            </div>
            <div v-if="crs.assignmentList.length == 0">There's no assignment yet</div>
        </div>

        <transition name="popup">
            <div v-if="isEditAssignment" class="asm-panel-container">
                <div class="asm-panel">
                    <div class='close-btn' @click="isEditAssignment = false;"></div>
                    <h3 class="panel-title">Add Assignment</h3>

                    <div class="asm-group">
                        <span>Please choose a course:</span>
                        <select v-model="crs">
                            <option :value="{id:item.id, index:idx, cname:item.cname}" v-for="(item, idx) in courseList">{{item.cname}}</option>
                        </select>
                    </div>

                    <div class="asm-group">
                        <span>Assignment Title: </span><input type="text" v-model="asmTitle">
                        <span>ID: </span><input type="text" v-model="asmID">
                    </div>
                    <div v-for="(n,nidx) in asmQs" class="asm-group">
                        <span>Question {{nidx + 1}} content: </span><input type="text" v-model="n.content">
                        <span>weight: </span><input type="number" v-model="n.weight">
                    </div>
                    <button @click="completeAssignment" class="public-btn">Complete and publish</button>
                </div>
            </div>
        </transition>

        <transition name="popup">
            <div class="asm-panel-container" v-if="isMarkedAssignment">
                <mark-assignment>
                    <div class='close-btn' slot="btn"  @click="isMarkedAssignment = false;"></div>

                </mark-assignment>
            </div>

        </transition>

        <transition name="popup">
            <div class="popup-panel" v-if="isPop">{{info}}</div>
        </transition>

    </div>
</template>
<style lang="sass">
    @import './_subglobal.scss';
    @mixin crsItem($color){
        color:$color;
        font-weight: bold;
        font-size: 18px;
        line-height: 1.5;
    }
    .public-btn{
        @extend .btn;
        width: 40%;
        margin-top: 12px;
        align-self:center;

    }
    .asm-group{
        width: 100%;
        margin: 6px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: flex-start;

        span{
            width: 18%;
            text-align: right;
        }
        input, select,textarea{
            width: 28%;
            padding: 0 6px;
            border: 1px solid $gColor;
            color: $gColor;
            border-radius: 4px;
            box-sizing: border-box;
            line-height:1.5;
            &:focus{
                 outline: none;
             }
        },
        input, select{
            line-height: 2em;
        }

    }
    .crs-item{
        margin: 12px 0;
        height:auto;
        width: 100%;
        border-radius: 12px;
        background: #eee;
        padding:20px;
        box-sizing:border-box;

        &-id{
            @include crsItem(#999);
         }
         &-cname{
            @include crsItem($gColor);
          }

    }
    .asm-item{
        padding-left: 30px;
        line-height: 1.5;
        font-size: 14px;
    }
    .asm-panel-container{
        position: absolute;
        left:0px;
        top:0px;
        width: 100vw;
        height: 100vh;
        background-color: rgba(51,51,51,0.5);
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
    }
    .asm-panel{
        width: 75%;
        height: 80%;
        overflow: auto;
        padding: 20px;
        box-sizing: border-box;
        background-color: white;
        border-radius: 8px;
        box-shadow: 1px 1px 2px 1px $shadowColor;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .close-btn{
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 4px;
        border: 1px solid $gColor;
        position: absolute;
        top:12px;
        right: 12px;
        background: url('../../icon/close-btn.png') no-repeat;
        background-size: 16px 16px;
        background-color:white;

        &:hover{
            transition:background 0.3s;
            cursor: pointer;
             background: url('../../icon/close-btn-hover.png') no-repeat;
            background-color: $gColor;

         }
    }
    .asm-btn{
        @extend .btn;
        margin-right: 12px;
    }
</style>
<script>
    import request from '../../api/ajaxReq';
    import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
    import markAssignment from './markAssignment.vue'


    export default {
        computed:{
                ...mapState(['signedID'])
        },
        data:function(){
          return {
              courseList:[],
              isEditAssignment:false,
              crs:{
                  id:0,
                  cname:'',
                  index:0
              },
              asmTitle:'',
              asmQs:[
                  {
                      content:'',
                      weight:0
                  },
                  {
                      content:'',
                      weight:0
                  },
                  {
                      content:'',
                      weight:0
                  },
                  {
                      content:'',
                      weight:0
                  },
                  {
                      content:'',
                      weight:0
                  }
              ],
              asmID:0,
              info:'',
              isMarkedAssignment:false,
              isPop:false
          }
        },
        created(){
            this.getCourseList();
        },
        components:{
          markAssignment,
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
            addAssignment(){

                this.isEditAssignment = true;
            },
            completeAssignment(){
                var that = this;
                if(that.asmTitle == ''){
                    that.popPanel('Incomplement information. Title of the assignment is required.');
                    return;
                }
                for(let item of that.asmQs){
                    console.log(item.content)
                    if(item.content == ''){

                        that.popPanel('Incomplement information, please ensure that you have entered all the question contents');
                        return;
                    }
                }
                var op = {
                    method:'get',
                    path:'getList',
                    args:{
                        type:'Assignment',
                        signedID:that.asmID
                    }
                };
                request(op).then(function(x){
                    var data = JSON.parse(x.responseText);
                    if(data.length){
                        that.popPanel('AssignmentID exists. Please try another assignment ID');
                    }else{
                        var option = {
                            method:'post',
                            path:'createAssignment',
                            args:{
                                id:that.asmID,
                                aname:that.asmTitle,
                                cid:that.crs.id,
                            }
                        }
                        for(let i = 0; i < that.asmQs.length; i++){
                            var item = that.asmQs[i];
                            option.args[`Q${i + 1}_title`] = item.content;
                            option.args[`Q${i + 1}_weight`] = item.weight;
                        }

                        request(option).then(function(xhr){
                            that.popPanel('successful');
                            that.isEditAssignment = false;
                            that.courseList[that.crs.index].assignmentList.push({
                                id:that.asmID,
                                aname:that.asmTitle
                            });

                        }).catch(function(err){
                            that.popPanel(err.responseText);
                        })
                    }
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
                    for(let item of list){
                        let op = {
                            method:'get',
                            path:'getAList',
                            args:{
                                cid : item.id
                            }
                        }
                        request(op).then(function(x){
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
                }).catch(function(err){
                    console.log(err.responseText);
                })
            }
        }
    }
</script>
