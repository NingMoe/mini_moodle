<template>
    <div class="navigation">
        <div>
            <p id="nav-name">{{signedFname}} {{signedLname}}</p>
            <slot name="navi"></slot>
        </div>
        <button @click="logout" id="logout-btn">logout</button>

    </div>
</template>
<style lang="sass">
    @import '../style/_global.scss';
    #nav-name{
        color: $gColor;
        font-size: 1.5em;
        font-weight: bold;
        padding: 20px;
        text-align: center;
    }
    #logout-btn{
        @extend .btn;
        margin: 0 20px 20px 20px;
    }

</style>
<script>

    import {mapState,mapMutations} from 'vuex';
    import router from '../router';


    export default{

        computed:{
            ...mapState(['signedID','signedAs','signedFname','signedLname']),

        },
        methods:{
            ...mapMutations(['clearUser']),
            logout (){
                this.clearUser();
                router.push('/login');
            },
        }
    }
</script>