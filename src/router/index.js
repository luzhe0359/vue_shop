import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Users from '@/views/user/Users.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/users',
      children: [
        { path: '/users', component: Users }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  /*
   * @params to 将要访问的路径
   * @params from 从哪个路由跳转过来
   * @params next 一个函数，表示放行
   *    next() 放行
   *    next('/home') 强制跳转
   */
  // 如果访问登录页, 直接放行
  if (to.path === '/login') return next()
  // 获取 token
  const token = window.sessionStorage.getItem('token')
  // 如果没有 token , 强制跳转登录页
  if (!token) return next('/login')
  next()
})

export default router
