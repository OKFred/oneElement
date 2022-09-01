import axios from 'axios';
import Cookies from 'js-cookie';

const service = axios.create({
  baseURL: process.env.DEV_URL,
  timeout: 5000,
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (Cookies.get('code')) {
      config.headers['Authorization'] = Cookies.get('code');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function transformer(queryObj) {
  let { url, header } = queryObj.request;
  let data;
  let key = 'data';
  if (/GET/gi.test(queryObj.request.header.method)) {
    key = 'params';
    data = queryObj.request.data;
  } else if (queryObj.request.data instanceof FormData === false) {
    data = JSON.stringify(queryObj.request.data);
  }
  queryObj.response.data = await service({ ...header, url, [key]: data });
  return queryObj;
} // 请求数据转换，以迎合axios的请求参数

export { transformer };
export default service;
