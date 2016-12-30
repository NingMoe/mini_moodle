import request from '../api/ajaxReq';
import Vue from 'vue';

import Vuex from 'vuex'

Vue.use(Vuex);

var store = {
    state:{
        isSigned: false,
        signedAs: 'dafault',
        signedID: 'default',
        signedFname:'',
        signedLname:''
    },
    getters:{

    },
    mutations: {
        setUser (state, data){
            state.isSigned = true;
            state.signedAs = data.signedAs;
            state.signedID = data.signedID;
            state.signedFname = data.signedFname;
            state.signedLname = data.signedLname;

            localStorage.setItem('isSigned', true);
            localStorage.setItem('fname',state.signedFname);
            localStorage.setItem('lname',state.signedLname);
            localStorage.setItem('type',state.signedAs);
            localStorage.setItem('id', state.signedID);

        },
        clearUser (state){
            state.isSigned = false;
            state.signedAs = 'dafault';
            state.signedID = 'default';
            state.signedFname = '';
            state.signedLname = '';

            localStorage.removeItem('isSigned');
            localStorage.removeItem('fname');
            localStorage.removeItem('lname');
            localStorage.removeItem('type');
            localStorage.removeItem('id');

        }
    },
    modules:{
    }

}
export default new Vuex.Store(store);