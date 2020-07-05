import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/welcome' },
    { path: '/login', component: () => import(/* webpackChunkName:"login_home_welcome" */ '@/views/Login.vue') },
    {
      path: '/home',
      component: () => import(/* webpackChunkName:"login_home_welcome" */ '@/views/Home.vue'),
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: () => import(/* webpackChunkName:"login_home_welcome" */ '@/views/Welcome.vue') },
        { path: '/users', component: () => import(/* webpackChunkName:"user_rights_roles" */ '@/views/user/Users.vue') },
        { path: '/rights', component: () => import(/* webpackChunkName:"user_rights_roles" */ '@/views/power/Rights.vue') },
        { path: '/roles', component: () => import(/* webpackChunkName:"user_rights_roles" */ '@/views/power/Roles.vue') },
        { path: '/categories', name: '商品分类', component: () => import(/* webpackChunkName:"categories_params" */ '@/views/shop/Categories.vue') },
        { path: '/params', name: '分类参数', component: () => import(/* webpackChunkName:"categories_params" */ '@/views/shop/Params.vue') },
        { path: '/reports', name: '统计报表', component: () => import(/* webpackChunkName:"reports" */ '@/views/stats/Reports.vue') }
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
