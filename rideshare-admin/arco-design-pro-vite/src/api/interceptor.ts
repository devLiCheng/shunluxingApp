import axios from 'axios';

// 覆盖拦截器 - 直接处理 NestJS 响应格式（无外层 code/data/msg 包装）
axios.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('rideshare_admin_token');
  if (token) {
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rideshare_admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
