<template>
    <div>


        <component :is="currentView"></component>

    </div>
</template>
<style lang="sass">
    @import '../style/_global.scss';

</style>
<script>
    import {mapState, mapMutations, mapActions, mapGetters} from 'vuex';
    import teacher from './teacherDashboard.vue';
    import student from './student/submitAsm.vue'

    export default {
        data:function(){
            return{
                currentView:''
            }
        },
        created(){
            this.currentView = this.$route.params.type;
            var stateData = {
                signedID: localStorage.getItem('id'),
                signedAs: this.$route.params.type,
                signedFname: localStorage.getItem('fname'),
                signedLname: localStorage.getItem('lname')
            }
            this.setUser(stateData);
        },
        computed:{
                ...mapState({
                    signedAs:'signedAs',
                    id:'signedID',
                    lname:'signedLname',
                    fname:'signedFname',
                })
        },
        methods:{
                ...mapMutations([
                        'setUser'
                ])
        },
        components:{
            teacher,
            student
        }
    }
</script>