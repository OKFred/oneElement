import VueRouter from 'vue-router';
const routes = [
  {
    path: '/',
    component: () => import('../views/home'),
    meta: { title: '首页' },
  },
  {
    path: '/home',
    component: () => import('../views/home'),
    meta: { title: '首页' },
  },
  {
    path: '/login',
    component: () => import('../views/login'),
    meta: { title: '登录' },
  },
  {
    path: '/customer',
    component: () => import('../views/customer'),
    meta: { title: '客户' },
  },
  {
    path: '/map',
    component: () => import('../views/map'),
    meta: { title: '地图' },
  },
  {
    // 会匹配所有路径
    path: '*',
    component: () => import('../views/error/NotFound_404.vue'),
    meta: { title: '404 NOT FOUND' },
  },
];
let router = new VueRouter({ routes, mode: 'history' });
export default router;
