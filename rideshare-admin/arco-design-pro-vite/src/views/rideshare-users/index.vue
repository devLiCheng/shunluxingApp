<template>
  <div>
    <a-page-header title="用户管理" :show-back="false" />
    <a-card>
      <a-table
        :data="users"
        :loading="loading"
        :pagination="{ total, pageSize, current: page, onChange: handlePage, showTotal: true }"
        row-key="id"
      >
        <template #columns>
          <a-table-column title="用户" data-index="name">
            <template #cell="{ record }">
              <a-space>
                <a-avatar :size="32" style="background: #165DFF">{{ record.name[0] }}</a-avatar>
                <div>
                  <div style="font-weight:500">{{ record.name }}</div>
                  <div style="color:#86909C;font-size:12px">{{ record.phone }}</div>
                </div>
              </a-space>
            </template>
          </a-table-column>
          <a-table-column title="角色" data-index="role">
            <template #cell="{ record }">
              <a-tag :color="record.role === 'admin' ? 'purple' : record.role === 'driver' ? 'blue' : 'gray'">
                {{ { admin: '管理员', driver: '车主', passenger: '乘客' }[record.role] || record.role }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="认证" data-index="driverVerified">
            <template #cell="{ record }">
              <a-tag :color="record.driverVerified ? 'green' : 'gray'">
                {{ record.driverVerified ? '已认证' : '未认证' }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column title="评分" data-index="rating">
            <template #cell="{ record }">
              <a-rate :model-value="Number(record.rating)" :count="5" allow-half readonly />
              <span style="margin-left:4px;color:#86909C">{{ record.rating }}</span>
            </template>
          </a-table-column>
          <a-table-column title="行程数" data-index="tripCount" />
          <a-table-column title="状态" data-index="isActive">
            <template #cell="{ record }">
              <a-badge :status="record.isActive ? 'success' : 'danger'" :text="record.isActive ? '正常' : '已禁用'" />
            </template>
          </a-table-column>
          <a-table-column title="注册时间" data-index="createdAt">
            <template #cell="{ record }">{{ new Date(record.createdAt).toLocaleDateString() }}</template>
          </a-table-column>
          <a-table-column title="操作">
            <template #cell="{ record }">
              <a-popconfirm :content="`确定${record.isActive ? '禁用' : '启用'}用户 ${record.name}？`" @ok="toggle(record)">
                <a-button :type="record.isActive ? 'text' : 'text'" :status="record.isActive ? 'danger' : 'success'" size="small">
                  {{ record.isActive ? '禁用' : '启用' }}
                </a-button>
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
import { getUsers, toggleUser } from '@/api/rideshare';

const users = ref<any[]>([]);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);

async function load() {
  loading.value = true;
  try {
    const res = await getUsers(page.value, pageSize.value);
    users.value = res.data.items;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
}

function handlePage(p: number) {
  page.value = p;
  load();
}

async function toggle(record: any) {
  await toggleUser(record.id);
  Message.success(record.isActive ? '已禁用' : '已启用');
  load();
}

onMounted(load);
</script>
