<template>
  <div>
    <a-page-header title="车主管理" subtitle="已认证车主列表" :show-back="false" />
    <a-card>
      <a-table
        :data="drivers"
        :loading="loading"
        :pagination="{ total, pageSize: 20, current: page, onChange: handlePage, showTotal: true }"
        row-key="id"
      >
        <template #columns>
          <a-table-column title="车主" data-index="name">
            <template #cell="{ record }">
              <a-space>
                <a-avatar style="background:#722ED1">{{ record.name[0] }}</a-avatar>
                <div>
                  <div style="font-weight:500">{{ record.name }}</div>
                  <div style="color:#86909C;font-size:12px">{{ record.phone }}</div>
                </div>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column title="车辆信息">
            <template #cell="{ record }">
              <div style="font-weight:500">{{ record.carModel }}</div>
              <div style="color:#86909C;font-size:12px">{{ record.carPlate }} · {{ record.carColor }}</div>
            </template>
          </a-table-column>
          <a-table-column title="身份证" data-index="idCard">
            <template #cell="{ record }">
              <span v-if="record.idCard">{{ record.idCard.slice(0,6) + '********' + record.idCard.slice(-4) }}</span>
              <span v-else style="color:#86909C">未提供</span>
            </template>
          </a-table-column>
          <a-table-column title="评分" data-index="rating">
            <template #cell="{ record }">
              <a-rate :model-value="Number(record.rating)" allow-half readonly />
              <span style="margin-left:4px">{{ record.rating }}</span>
            </template>
          </a-table-column>
          <a-table-column title="行程数" data-index="tripCount" />
          <a-table-column title="认证状态">
            <template #cell="{ record }">
              <a-tag color="green">
                <template #icon><icon-check-circle /></template>
                已认证
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="注册时间" data-index="createdAt">
            <template #cell="{ record }">{{ new Date(record.createdAt).toLocaleDateString() }}</template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getDrivers } from '@/api/rideshare';

const drivers = ref<any[]>([]);
const loading = ref(false);
const page = ref(1);
const total = ref(0);

async function load() {
  loading.value = true;
  try {
    const res = await getDrivers(page.value);
    drivers.value = res.data.items;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
}

function handlePage(p: number) { page.value = p; load(); }

onMounted(load);
</script>
