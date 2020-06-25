import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../components/Login.vue'
import User from '../components/User.vue'
import Rights from '../components/Rights.vue'
import Roles from '../components/Role.vue'
import Categories from '../components/Categories.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component:Home,
    children:[
      {
        path:'/home/',
        name:'home',
        component:User
      },
      {
      path:'/home/users',
      name:'home',
      component:User
      },
      {
        path:'/home/rights',
        name:'rights',
        component:Rights
      },
      {
        path:'/home/roles',
        name:'role',
        component:Roles
      },
      {
        path:'/home/categories',
        name:'categories',
        component:Categories
      }
      
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to,from,next)=>{
  if(to.path == '/login'){
    return next();
  }
  let token = sessionStorage.getItem('token')
  if(token){
    next();
  }else{
    next('/login');
  }
  
})

export default router
