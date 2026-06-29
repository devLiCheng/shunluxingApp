<template>
  <div class="rideshare-dashboard">
    <a-page-header title="顺风搭控制台" subtitle="平台数据总览" :show-back="false" />

    <!-- 统计卡片 -->
    <a-row :gutter="16" style="margin-bottom: 16px">
      <a-col :span="6" v-for="item in stats" :key="item.label">
        <a-card hoverable>
          <a-statistic
            :title="item.label"
            :value="item.value"
            :value-style="{ color: item.color, fontSize: '28px', fontWeight: 700 }"
          >
            <template #prefix>
              <component :is="item.icon" :style="{ color: item.color, marginRight: '8px' }" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快捷入口 -->
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card title="最近行程" :loading="loading">
          <a-list :data="recentTrips" :max-height="300">
            <template #item="{ item }">
              <a-list-item>
                <a-list-item-meta
                  :title="`${item.from} → ${item.to}`"
                  :description="`${item.date} ${item.time} · ¥${item.price}`"
                />
                <template #actions>
                  <a-tag :color="statusColor(item.status)">{{ statusLabel(item.status) }}</a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="功能导航">
          <a-grid :cols="2" :row-gap="12" :col-gap="12">
            <a-grid-item v-for="nav in navItems" :key="nav.path">
              <a-button
                long
                :type="nav.type"
                @click="$router.push(nav.path)"
              >
                {{ nav.label }}
              </a-button>
            </a-grid-item>
          </a-grid>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="平台概况">
          <a-descriptions :data="descData" layout="vertical" bordered />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { IconUser, IconCar, IconCheckCircle, IconSchedule } from '@arco-design/web-vue/es/icon';
import { getDashboard, getTrips } from '@/api/rideshare';

const loading = ref(false);
const dashData = ref({ totalUsers: 0, totalTrips: 0, totalBookings: 0, verifiedDrivers: 0 });
const recentTrips = ref<any[]>([]);

const stats = computed(() => [
  { label: '总用户数', value: dashData.value.totalUsers, color: '#165DFF', icon: IconUser },
  { label: '总行程数', value: dashData.value.totalTrips, color: '#00B42A', icon: IconSchedule },
  { label: '总预订数', value: dashData.value.totalBookings, color: '#FF7D00', icon: IconCheckCircle },
  { label: '认证车主', value: dashData.value.verifiedDrivers, color: '#722ED1', icon: IconCar },
]);

const navItems = [
  { label: '用户管理', path: '/rideshare/users', type: 'outline' },
  { label: '行程管理', path: '/rideshare/trips', type: 'outline' },
  { label: '车主审核', path: '/rideshare/drivers', type: 'outline' },
  { label: '查看API文档', path: '/rideshare/api-docs', type: 'secondary' },
];

const descData = computed(() => [
  { label: '注册用户', value: dashData.value.totalUsers + ' 人' },
  { label: '认证车主', value: dashData.value.verifiedDrivers + ' 人' },
  { label: '行程总数', value: dashData.value.totalTrips + ' 条' },
  { label: '预订总数', value: dashData.value.totalBookings + ' 条' },
]);

const statusColor = (s: string) => ({ open: 'green', full: 'orange', cancelled: 'red', completed: 'blue' }[s] || 'gray');
const statusLabel = (s: string) => ({ open: '招募中', full: '已满', cancelled: '已取消', completed: '已完成' }[s] || s);

onMounted(async () => {
  loading.value = true;
  try {
    const [dash, trips] = await Promise.all([getDashboard(), getTrips(1)]);
    dashData.value = dash.data;
    recentTrips.value = (trips.data.items || []).slice(0, 5);
  } catch (e) {
    // ignore
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.rideshare-dashboard { padding: 0 0 24px; }
</style>
