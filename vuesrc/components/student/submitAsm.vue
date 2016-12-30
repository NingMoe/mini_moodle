<template>
    <div class="dashboard">
        <navigation></navigation>
        <div class="panel">
            <h2  class="panel-title">Assignment Management</h2>

            <div>
                <div v-for="(crs, idx) in courseList" class="crs-item">
                    <span class="crs-item-id">{{crs.cid}}</span> | <span  class="crs-item-cname">{{crs.cname}}</span>

                    <div v-for="(asm, aidx) in crs.asmInfo" class="asm-item">
                        <span class="asm-item-id">{{asm.aid}}</span> - <span class="asm-item-aname">{{asm.aname}}</span>
                        <span class='mark-tag' v-if="asm.isMarked">marked</span><span class='submitted-tag' v-if="asm.isSubmitted">submitted</span>
                        <span v-if="!asm.isSubmitted" @click="showSubmitPanel(asm.alist, asm.aid, idx, aidx)" class="sm-btn">answer</span>
                        <span v-if="asm.isMarked" @click="showDetailPanel(asm.alist, asm.aid, idx, aidx)" class="sm-btn">details</span>
                    </div>
                </div>
            </div>
            <transition name="popup">
                <div class="asm-panel-container"  v-if="isDetailPanel">
                    <div id="detailPanel" class="asm-panel">
                        <div @click="isDetailPanel = false;" class="close-btn"></div>
                        <p class="panel-title">{{courseList[currentIdxs.idx].asmInfo[currentIdxs.aidx].aname}}</p>
                        <div class="answer-item"><span>#. (weight)</span><span>Answer</span><span>Score</span></div>

                        <div class="answer-item"><span>Q1 ({{currentAnsList.Q1.weight}})</span><span>{{currentAnsList.Q1.answer}}</span><span>{{currentAnsList.Q1.score}}</span></div>
                        <div class="answer-item"><span>Q2 ({{currentAnsList.Q2.weight}})</span><span>{{currentAnsList.Q2.answer}}</span><span>{{currentAnsList.Q2.score}}</span></div>
                        <div class="answer-item"><span>Q3 ({{currentAnsList.Q3.weight}})</span><span>{{currentAnsList.Q3.answer}}</span><span>{{currentAnsList.Q3.score}}</span></div>
                        <div class="answer-item"><span>Q4 ({{currentAnsList.Q4.weight}})</span><span>{{currentAnsList.Q4.answer}}</span><span>{{currentAnsList.Q4.score}}</span></div>
                        <div class="answer-item"><span>Q5 ({{currentAnsList.Q5.weight}})</span><span>{{currentAnsList.Q5.answer}}</span><span>{{currentAnsList.Q5.score}}</span></div>
                        <div id="t-comment">Instructor's comment: {{courseList[currentIdxs.idx].asmInfo[currentIdxs.aidx].comment}}</div>
                        <div id="final-score">final score: {{courseList[currentIdxs.idx].asmInfo[currentIdxs.aidx].final}}</div>
                    </div>
                </div>
            </transition>

            <transition name="popup">
                <div v-if="isPop" class="popup-panel">
                    {{info}
                </div>

            </transition>

            <transition name="popup">
                <div class="asm-panel-container"  v-if="isSubmitPanel">
                    <div id="submitPanel" class='asm-panel'>
                        <div @click="isSubmitPanel = false;" class="close-btn"></div>
                        <p class="panel-title">Answer Assignment</p>
                        <div class="mark-area">
                            <div class="mark-group">
                                <span>Q1: {{currentAnsList.Q1.title}}</span>
                                <input type="text" v-model="currentAnsList.Q1.answer" id="q1Ans">
                            </div>
                            <div class="mark-group">
                                <span>Q2: {{currentAnsList.Q2.title}}</span>
                                <input type="text" v-model="currentAnsList.Q2.answer" id="q2Ans">
                            </div>
                            <div class="mark-group">
                                <span>Q3: {{currentAnsList.Q3.title}}</span>
                                <input type="text" v-model="currentAnsList.Q3.answer" id="q3Ans">
                            </div>
                            <div class="mark-group">
                                <span>Q4: {{currentAnsList.Q4.title}}</span>
                                <input type="text" v-model="currentAnsList.Q4.answer" id="q4Ans">
                            </div>
                            <div class="mark-group">
                                <span>Q5: {{currentAnsList.Q5.title}}</span>
                                <input type="text" v-model="currentAnsList.Q5.answer" id="q5Ans">
                            </div>
                            <button @click="submitAns" id="subasm-btn">submit assignment</button>

                        </div>

                    </div>

                </div>

            </transition>
        </div>


    </div>
</template>
<style lang="sass" scoped>
@import './_subglobal.scss';

    #t-comment{
        line-height: 1.5;
        width: 50%;
    }
    .sm-btn{
        color:white;
        font-size: 12px;
        padding: 2px;
        background-color: $gColor;
        box-shadow:inset 0 -1px 0 rgba(0,0,0,0.12);
        border-radius: 2px;
        margin:0 3px;
        width:auto;

        &:hover{
            cursor: pointer;
         }

    }
    #subasm-btn{
        @extend .btn;
        width: 40%;
        align-self: center;
        margin-top: 24px;
    }
    .mark-area{
        width: 100%;
    }
    .mark-group{
        span{
            width: 50%;
        }
        input{
            width: 50%;
        }
    }
    #final-score{
        color: $gColor;
        font-weight: bold;
        margin: 12px 0;
    }
    .answer-item{
        width: 100%;
        padding: 6px;
        margin: 1px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        box-sizing:border-box;
        background-color:#eee;
        span:nth-of-type(1){
            width: 20%;
            text-align: center;
        }
        span:nth-of-type(2){
            width: 60%;
        }
        span:nth-of-type(3){
            width: 20%;
            text-align: center;

        }

        &:first-of-type{
            background-color: $gColor;
            color:white;
            text-align:center;
         }

    }

</style>
<script>
    import request from '../../api/ajaxReq';
    import {mapState, mapMutations} from 'vuex';
    import navigation from '../navigation.vue';

    export default{
        computed:{
                ...mapState(['signedID', 'signedFname', 'signedLname']),
        },
        components:{
          navigation
        },
        data:function(){
            return{
                courseList:[],
                isSubmitPanel:false,
                currentAnsList:{},
                currentAnsAid:0,
                currentIdxs:{},
                isPop: false,
                isDetailPanel:false,
                info:''


            }
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
            submitAns(){

                var that = this;
                var idx = this.currentIdxs.idx;
                var aidx = this.currentIdxs.aidx;

                var option = {
                    method:'post',
                    path:'updateAnswer',
                    args:{
                        sid:this.signedID,
                        aid:this.courseList[idx].asmInfo[aidx].aid,

                    }
                };

                for(let i = 1; i <= 5; i++){
                    option.args[`Q${i}_answer`] = that.currentAnsList[`Q${i}`].answer;
                }

                request(option).then(function(xhr){

                    that.courseList[idx].asmInfo[aidx].isSubmitted = true;
                    that.popPanel(`successfully submitted assignment ${that.courseList[that.currentIdxs.idx].asmInfo[that.currentIdxs.aidx].aname}`);
                    that.isSubmitPanel = false;
                })



            },
            showDetailPanel(alist, aid, idx, aidx){
                var that = this;

                this.currentAnsList = alist;
                this.currentAnsAid = aid;
                this.currentIdxs = {
                    idx:idx,
                    aidx:aidx
                };

                that.isDetailPanel = true;
            },
            showSubmitPanel(alist, aid, idx, aidx){

                this.currentAnsList = alist;
                this.currentAnsAid = aid;
                this.currentIdxs = {
                    idx:idx,
                    aidx:aidx
                }
                this.isSubmitPanel = true;
            },
            getCourseList(){
                var that = this;
              var op = {
                  method:'get',
                  path:'getStuCourse',
                  args:{
                      sid:that.signedID
                  }
              };
              request(op).then(function(xhr){
                  var data = JSON.parse(xhr.responseText);

                  fetch();

                  async function fetch(){
                      for(let item of data){
                          var newOne = {
                              cid:item.cid,
                              cname:item.cname,
                              asmInfo:[],
                              isAsmExpanded:false
                          };

                          var option = {
                              method: 'get',
                              path: 'getStuAsmInfo',
                              args: {
                                  cid: item.cid,
                                  sid: that.signedID,
                              }
                          };
                          await request(option).then(function(x){

                          var srs = JSON.parse(x.responseText);
                          for(let s of srs){
                              var k = {
                                  aid:s.aid,
                                  aname:s.aname,
                                  isMarked:(s.marked == 1)?true:false,
                                  isSubmitted:(s.isSubmitted == 1)? true:false,
                                  alist:{},
                                  final:s.final,
                                  comment:s.comment
                              }

                              for(let i = 1; i <=5; i++){
                                  k.alist[`Q${i}`] = {
                                      title:s[`Q${i}_title`],
                                      answer:s[`Q${i}_answer`],
                                      weight:s[`Q${i}_weight`],
                                      score:s[`Q${i}_score`]
                                  }
                              }
                              newOne.asmInfo.push(k)
                          }
                              that.courseList.push(newOne);
                      }).catch(function(err){
                          console.log(err);
                      })
                      }
                  }

              }).catch(function(err){
                  console.log(err.responseText);
              })
            },
        },
        created:function(){
            this.getCourseList();
        }
    }
</script>