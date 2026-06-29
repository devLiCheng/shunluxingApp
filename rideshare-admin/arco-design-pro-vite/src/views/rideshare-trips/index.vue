<template>
  <div>
    <a-page-header title="行程管理" :show-back="false" />
    <a-card>
      <a-space style="margin-bottom:16px">
        <a-select v-model="filterStatus" placeholder="全部状态" allow-clear style="width:140px" @change="load">
          <a-option value="open">招募中</a-option>
          <a-option value="full">已满员</a-option>
          <a-option value="cancelled">已取消</a-option>
          <a-option value="completed">已完成</a-option>
        </a-select>
        <a-button @click="load">刷新</a-button>
      </a-space>
      <a-table
        :data="trips"
        :loading="loading"
        :pagination="{ total, pageSize: 20, current: page, onChange: handlePage, showTotal: true }"
        row-key="id"
      >
        <template #columns>
          <a-table-column title="线路">
            <template #cell="{ record }">
              <span style="font-weight:500">{{ record.from }}</span>
              <span style="color:#86909C;margin:0 6px">→</span>
              <span style="font-weight:500">{{ record.to }}</span>
            </template>
          </a-table-column>
          <a-table-column title="车主" data-index="driver">
            <template #cell="{ record }">
              {{ record.driver?.name || '-' }}
              <div style="color:#86909C;font-size:12px">{{ record.driver?.carModel || '' }}</div>
            </template>
          </a-table-column>
          <a-table-column title="时间" data-index="date">
            <template #cell="{ record }">{{ record.date }} {{ record.time }}</template>
          </a-table-column>
          <a-table-column title="座位" data-index="availableSeats">
            <template #cell="{ record }">{{ record.availableSeats }}/{{ record.seats }}</template>
          </a-table-column>
          <a-table-column title="价格" data-index="price">
            <template #cell="{ record }">¥{{ record.price }}</template>
          </a-table-column>
          <a-table-column title="状态" data-index="status">
            <template #cell="{ record }">
              <a-tag :color="{ open:'green', full:'orange', cancelled:'red', completed:'blue' }[record.status]">
                {{ { open:'招募中', full:'已满', cancelled:'已取消', completed:'已完成' }[record.status] }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-popconfirm
                v-if="record.status === 'open' || record.status === 'full'"
                content="确定强制取消该行程？"
                @ok="cancel(record)"
              >
                <a-button type="text" status="danger" size="small">取消行程</a-button>
              </a-popconfirm>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Message } from '@arco-design/web-vue';
import { getTrips, cancelTripAdmin } from '@/api/rideshare';

const trips = ref<any[]>([]);
const loading = ref(false);
const page = ref(1);
const total = ref(0);
const filterStatus = ref('');

async function load() {
  loading.value = true;
  try {
    const res = await getTrips(page.value, filterStatus.value || undefined);
    trips.value = res.data.items;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
}

function handlePage(p: number) { page.value = p; load(); }

async function cancel(record: any) {
  await cancelTripAdmin(record.id);
  Message.success('行程已取消');
  load();
}

onMounted(load);
</script>
