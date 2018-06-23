import axios from 'axios';
import { Message } from 'element-ui';

const myaxios = {};
myaxios.install = function(Vue) {
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/',
    timeout: 100000
  });

  // 设置axios的拦截器
  instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (config.url.toLowerCase() !== 'login') {
      // 如果其他的接口,要携带token
      const token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // 设置axios的拦截器
  instance.interceptors.response.use(function (response) {
    // 当获取到服务器的响应之后, 并且再交给请求动作之前
    const { data: { meta: { status, msg } } } = response;

    if (status !== 200 && status !== 201) {
      Message.error(msg);
    }

    return response;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // 设置Vue实例的属性
  Vue.prototype.$http = instance;
};

export default myaxios;
