import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const RIDESHARE: AppRouteRecordRaw = {
  path: '/rideshare',
  name: 'rideshare',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: '顺风搭管理',
    requiresAuth: true,
    icon: 'icon-car',
    order: 1,
  },
  children: [
    {
      path: 'dashboard',
      name: 'RideshareDashboard',
      component: () => import('@/views/rideshare-dashboard/index.vue'),
      meta: {
        locale: '控制台',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-dashboard',
      },
    },
    {
      path: 'users',
      name: 'RideshareUsers',
      component: () => import('@/views/rideshare-users/index.vue'),
      meta: {
        locale: '用户管理',
        requiresAuth: true,
        roles: ['admin'],
        icon: 'icon-user',
      },
    },
    {
      path: 'trips',
      name: 'RideshareTrips',
      component: () => import('@/views/rideshare-trips/index.vue'),
      meta: {
        locale: '行程管理',
        requiresAuth: true,
        roles: ['admin'],
        icon: 'icon-schedule',
      },
    },
    {
      path: 'drivers',
      name: 'RideshareDrivers',
      component: () => import('@/views/rideshare-drivers/index.vue'),
      meta: {
        locale: '车主管理',
        requiresAuth: true,
        roles: ['admin'],
        icon: 'icon-check-circle',
      },
    },
  ],
};

export default RIDESHARE;
