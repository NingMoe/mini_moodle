import Vue from 'vue'
import VueRouter from 'vue-router'

import login from './components/login.vue'
import dashboard from './components/dashboard.vue'


//child route
import addStudent from './components/teacher/addStudent.vue'
import addCourse from './components/teacher/addCourse.vue'
import addAssignment from './components/teacher/addAssignment.vue'



Vue.use(VueRouter);

var router = new VueRouter({
    routes:[
        {
            path:'/login',
            component:login,

            // name:
        },
        {
            path:'/',
            beforeEnter: (to, from, next) => {
                var signed = localStorage.getItem('isSigned');
                if(!signed){

                    next({
                        path:'/login',
                        query:{
                            redirect:'login'
                        }
                    })
                }else{
                    var uname = localStorage.getItem('fname') + "_" + localStorage.getItem('lname');
                    var type = localStorage.getItem('type');
                    next({
                       name:'dash',
                        params:{
                            type,
                            user:uname
                        }
                    });
                }
            }
        },{
            path:'/:type/:user',
            name:'dash',
            component:dashboard,
            children:[
                {
                    path:'studentManagement',
                    component:addStudent
                },
                {
                    path:'courseManagement',
                    component: addCourse
                },
                {
                    path:'assignmentManagement',
                    component:addAssignment
                }
            ]
        }

    ],
    linkActiveClass:'link-active'
})

export default router;