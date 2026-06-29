import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

const BASE = import.meta.env.VITE_API_BASE_URL || '';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

export function login(data: LoginData) {
  // NestJS 接口使用 phone 字段
  return axios.post(`${BASE}/api/auth/login`, {
    phone: data.username,
    password: data.password,
  }).then((res: any) => {
    const { accessToken, user } = res.data;
    // 存 token
    localStorage.setItem('rideshare_admin_token', accessToken);
    return { data: { token: accessToken, ...user } };
  });
}

export function logout() {
  localStorage.removeItem('rideshare_admin_token');
  return Promise.resolve({ data: {} });
}

export function getUserInfo() {
  const BASE = import.meta.env.VITE_API_BASE_URL || '';
  return axios.get(`${BASE}/api/auth/me`).then((res: any) => ({
    data: {
      name: res.data.name,
      avatar: res.data.avatar || 'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440d776cb45.png~tplv-uwbnlip3yd-webp.webp',
      role: res.data.role,
      phone: res.data.phone,
      accountId: res.data.id,
    }
  }));
}

export function getMenuList() {
  return Promise.resolve({ data: [] as RouteRecordNormalized[] });
}
