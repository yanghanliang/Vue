import Vue from 'vue';
import Router from 'vue-router';

// 导入主键
import Login from '@/views/login';
import Home from '@/views/home';
import Users from '@/views/users/users';

Vue.use(Router);

export default new Router({
  routes: [
    { name: 'login', path: '/login', component: Login },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        // 子路由
        {
          name: 'users',
          path: 'users',
          component: Users
        }
      ]
    }
  ]
});
