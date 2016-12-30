<template>

    <div class="dashboard">
        <navigation>
            <ul slot="navi" class="nav-list">
                <li class="nav-item"><router-link :to="stuMgmLink">Student Management</router-link></li>
                <li class="nav-item"><router-link :to="crsMgmLink">Course Management</router-link></li>
                <li class="nav-item"><router-link :to="asmMgmLink">Assignment Management</router-link></li>
            </ul>
        </navigation>

        <div class="panel">
            <router-view></router-view>
        </div>
    </div>

</template>
<style lang="sass">
    @import '../style/_global.scss';

    .nav-list{
        padding: 20px;
        text-align: center;
    }
    .nav-item{
        margin-top: 12px;
    }


</style>
<script>

    import {mapState,mapMutations} from 'vuex';
    import router from '../router';

    import navigation from './navigation.vue';

    export default{
        components:{
          navigation
        },
        computed:{
                ...mapState(['signedID','signedAs','signedFname','signedLname']),
            stuMgmLink (){
                return `/${this.signedAs}/${this.signedFname}_${this.signedLname}/studentManagement`;
            },
            crsMgmLink (){
                return `/${this.signedAs}/${this.signedFname}_${this.signedLname}/courseManagement`;
            },
            asmMgmLink (){
                return `/${this.signedAs}/${this.signedFname}_${this.signedLname}/assignmentManagement`;
            },

        },
        methods:{
        }
    }
</script>