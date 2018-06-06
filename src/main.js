// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';

// 导入elementUi
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 引入全局样式
import '@/assets/css/index.css';
// 导入自己写的myaxios插件
import MyAxios from '@/plugins/myaxios';
// 导入moment
import moment from 'moment';

// 全局配置ElementUI
Vue.use(ElementUI);
// 注册
Vue.use(MyAxios);

// 格式化日期的过滤器
Vue.filter('fmtDate', (value, fmtStr) => {
  return moment(value).format(fmtStr);
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
