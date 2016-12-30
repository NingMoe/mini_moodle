<template>
    <div id="login-container">
        <div id="login-welcome">
            <h1>Mini Moodle</h1>
            <p>Welcome to Mini Moodle! Please login before managing your courses and assignments.
                If you are a student, please choose 'I'm student'; otherwise, please choose 'I'm teacher'</p>
        </div>
        <form id="login-panel">
            <label for="signedID" class="login-group"><span>id</span><input type="text" id="signedID" v-model="signedID" class="login-input"></label>
            <label for="signedPW" class="login-group"><span>password</span><input type="password" id="signedPW" v-model="signedPW" class="login-input"></label>
            <label class="login-selection"><input type="radio" value="student" v-model="signedAs">I'm student</label>
            <label class="login-selection"><input type="radio" value="teacher" v-model="signedAs">I'm teacher</label>
            <input  type="submit" value="submit" v-on:click.prevent="checkLogin($event)" id="login-btn">
            <transition name="popup">
                <div v-if="isLoginFailed" class="popup-panel">
                    failed: {{failedText}}
                </div>
            </transition>

        </form>


    </div>

</template>
<style lang="sass">

    @import '../style/_global.scss';
    #login-container{
        height: 90vh;
        display: flex;
        flex-direction: column;
        justify-content:center;
        align-items: center;
    }
    #login-welcome{
        font-size: 14px;
        width: 45%;
        text-align:center;

    h1{
            color:$gColor;
            font-size: 3em;
            font-weight: bold;
            line-height: 1.5;
        }
        p{
            line-height: 1.5;
            color:$fontColor;
        }

    }
    #login-panel{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items:center;
        width: 30%;
        border-radius: 6px;
        padding: 20px;
        box-sizing:border-box;
        box-shadow: 1px 1px 2px 1px $shadowColor;
        margin-top: 20px;
    }
    .login-selection{
        width: 60%;
        align-self:flex-end;
        font-size: 12px;
        color:$gColor;
        height: 1.4em;
        line-height: 1.4em;
    }
    .login-input{
        display: inline-block;
        font-family: $defaultFont;
        line-height: 2em;
        font-size: 14px;
        height: 2em;
        color: $gColor;
        border-radius:4px;
        border: 1px solid $gColor;
        padding: 0 6px;
        width:60%;
        box-sizing:border-box;
        &:focus{
            outline:none;
         }
    }
    .login-group{
        margin: 6px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items:center;
        color:$gColor;
        width:100%;
        span{
            display: block;
            text-align: right;
            width: 30%;
            box-sizing: border-box;
        }
    }
    #login-btn{
        @extend .btn;
        width: 50%;
        margin: 12px 0 0 0;
    }

</style>
<script>
    import request from '../api/ajaxReq';
    import router from '../router';
    import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';



    export default {
        data:function(){
            return{
                signedID:'',
                signedPW:'',
                isLoginFailed:false,
                failedText:'',
                signedAs:''
            }
        },
        methods:{
            ...mapMutations([
                'setUser'
            ]),
            checkLogin(e){
                var that = this;
                var reqOp = {
                    method:'post',
                    path:'check',
                    args:{
                        id:this.signedID,
                        password:this.signedPW,
                        type:this.signedAs
                    }
                }
                request(reqOp).then(function(xhr){
                    var data = xhr.responseText;
                    data = JSON.parse(data);
                    var usrData = {
                        isSigned: true,
                        signedAs: that.signedAs,
                        signedID:that.signedID,
                        signedFname: data.fname,
                        signedLname: data.lname
                    }
                    //that.$store.commit('setUser', usrData);
                    that.setUser(usrData);
                    router.push({
                        name:'dash',
                        params:{
                            type:that.signedAs,
                            user:data.fname + '_' + data.lname
                        }
                    });
                }).catch(function(err){
                    that.isLoginFailed = true;
                    setTimeout(function(){
                        that.isLoginFailed = false;
                    },1500);
                    that.failedText = err.responseText;
                })
            },


        },

        computed:{

        },

    }
</script>