import 'babel-polyfill'
import Vue from 'vue'

import Vuex from 'vuex'
import store from './store/store'
import router from './router'

require('./style/_reset.scss');

//components
import myapp from './components/app.vue'

var app = new Vue({
    template:'<myapp></myapp>',
    el:'#container',

    components:{
        myapp
    },
    router,
    store,


})

// module.exports = app;