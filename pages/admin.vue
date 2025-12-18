<template>
  <div class="min-h-screen bg-gray-50 flex font-sans text-gray-800">

    <!-- 侧边栏：模型列表 -->
    <aside class="w-60 bg-slate-800 text-gray-300 flex flex-col shadow-2xl z-10">
      <div class="p-5 border-b border-slate-700">
        <h1 class="text-xl font-bold tracking-wider text-white">Admin Console</h1>
        <p class="text-xs text-slate-400 mt-1">ZhuangMai Gallery</p>
      </div>
      <nav class="flex-1 overflow-y-auto py-3">
        <ul>
          <li v-for="model in models" :key="model">
            <button
              @click="currentModel = model; page = 1; fetchData()"
              class="w-full text-left px-5 py-2.5 text-sm hover:bg-slate-700 transition-colors flex items-center"
              :class="currentModel === model ? 'bg-slate-700 border-l-4 border-cinnabar font-semibold text-white' : 'border-l-4 border-transparent'"
            >
              {{ model }}
            </button>
          </li>
        </ul>
      </nav>
      <div class="p-3 border-t border-slate-700">
        <button @click="logout" class="w-full py-2 bg-slate-700 hover:bg-cinnabar rounded-md transition-colors text-sm font-bold text-white">退出</button>
      </div>
    </aside>

    <!-- 主内容区 -->
    <main class="flex-1 flex flex-col overflow-hidden">

      <!-- 表格区域 -->
      <div class="flex-1 overflow-auto p-6">

        <!-- 表格工具栏 -->
        <div class="bg-white rounded-t-lg border border-b-0 border-gray-200 px-5 py-4 flex justify-between items-center">
          <div class="flex items-center gap-4">
            <div>
              <h2 class="text-lg font-bold text-gray-700">{{ currentModel }}</h2>
              <p class="text-xs text-gray-500 mt-0.5">Total Records: {{ total }}</p>
            </div>
            
            <!-- 【核心新增】一键发布按钮 -->
            <button 
              v-if="currentModel === 'CollectionSet'" 
              @click="quickPublish"
              class="ml-4 px-3 py-1 bg-gradient-to-r from-gold to-yellow-600 text-white text-xs font-bold rounded shadow-sm hover:shadow-md transition-all flex items-center gap-1"
            >
              <span v-if="isPublishing">Processing...</span>
              <span v-else>✨ 一键生成演示卡池</span>
            </button>
          </div>

          <div class="flex items-center space-x-3">
            <button @click="fetchData" class="p-2 text-gray-400 hover:text-indigo-600 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" title="Refresh" :disabled="loading">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" :class="{'animate-spin': loading}" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <div class="flex space-x-1 items-center bg-gray-100 p-1 rounded-lg">
              <button @click="page > 1 && (page--, fetchData())" :disabled="page === 1 || loading" class="px-2 py-1 rounded-md hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg></button>
              <span class="text-xs text-gray-500 font-medium px-2">Page {{ page }}</span>
              <button @click="page * pageSize < total && (page++, fetchData())" :disabled="page * pageSize >= total || loading" class="px-2 py-1 rounded-md hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
            </div>
            <button @click="openCreateModal" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-colors text-sm font-bold flex items-center gap-2"><span>+</span> New</button>
          </div>
        </div>

        <!-- 数据表格 (保持不变) -->
        <div class="bg-white rounded-b-lg shadow-md border border-t-0 border-gray-200 overflow-hidden">
          <div v-if="loading" class="p-12 text-center text-gray-500"><div class="spinner-zhuang mx-auto mb-4"></div>Loading data...</div>
          <div v-else-if="items.length === 0" class="p-12 text-center text-gray-400">No records found in {{ currentModel }}.</div>
          <div v-else class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-600">
              <thead class="bg-gray-100 text-gray-500 font-medium border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 w-24">Actions</th>
                  <th v-for="key in columns" :key="key" class="px-6 py-3 whitespace-nowrap">{{ key }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 transition-colors group">
                  <td class="px-6 py-2 flex items-center gap-3 h-full">
                    <button @click="openEditModal(item)" class="text-indigo-600 hover:text-indigo-800 font-semibold">Edit</button>
                    <button @click="deleteItem(item.id)" class="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity font-medium">Delete</button>
                  </td>
                  <td v-for="key in columns" :key="key" class="px-6 py-2 whitespace-nowrap max-w-xs truncate" :title="String(item[key])">{{ formatValue(item[key]) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>

    <!-- Modal (保持不变) -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
          <h3 class="text-lg font-bold text-gray-800">{{ isEditing ? 'Edit Record' : 'New Record' }} in <span class="text-indigo-600">{{ currentModel }}</span></h3>
          <button @click="showModal = false" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <form @submit.prevent="saveItem">
          <fieldset :disabled="isSaving" class="contents">
            <div class="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div v-for="key in formColumns" :key="key" class="space-y-1">
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">{{ key }}</label>
                <input v-if="isDateField(key)" type="datetime-local" v-model="formData[key]" class="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:opacity-60" />
                <textarea v-else-if="isLongText(key)" v-model="formData[key]" rows="3" class="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:opacity-60"></textarea>
                <input v-else type="text" v-model="formData[key]" class="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none disabled:opacity-60" />
              </div>
            </div>
            <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-end space-x-3">
              <button type="button" @click="showModal = false" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm font-medium">Cancel</button>
              <button type="submit" class="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm font-medium shadow-sm disabled:bg-indigo-400 flex items-center justify-center w-24"><svg v-if="isSaving" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span v-else>Save</span></button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from '~/composables/useToast'

const { showToast } = useToast()

const models = ['User', 'community_gallery', 'CollectionSet', 'CardTemplate', 'UserCard', 'PointLog', 'Order', 'Interaction', 'ChatMessage']
const currentModel = ref(models[0])
const items = ref<any[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = 20
const loading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const formData = ref<any>({})
const isSaving = ref(false)
const isPublishing = ref(false) // 新增

const columns = computed(() => items.value.length === 0 ? [] : Object.keys(items.value[0]))
const formColumns = computed(() => items.value.length === 0 ? (isEditing.value ? Object.keys(formData.value).filter(k => k !== 'id') : []) : Object.keys(items.value[0]).filter(key => key !== 'id' && typeof items.value[0][key] !== 'object'))

// 一键发布逻辑 (新增)
const quickPublish = async () => {
  if (!confirm('确定要自动从已投稿作品生成一个新的演示卡池吗？')) return
  isPublishing.value = true
  try {
    const res: any = await $fetch('/api/admin/create-collection', { method: 'POST' })
    if (res.success) {
      showToast(res.message, 'success')
      fetchData() // 刷新列表
    } else {
      showToast(res.message, 'info')
    }
  } catch (e: any) {
    showToast(e.data?.message || '发布失败', 'error')
  } finally {
    isPublishing.value = false
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await $fetch('/api/admin/model', {
      method: 'POST',
      body: { model: currentModel.value, action: 'list', page: page.value, pageSize: pageSize }
    })
    items.value = res.items
    total.value = res.total
  } catch (e: any) { showToast(e.message, 'error') } 
  finally { loading.value = false }
}

// 辅助函数
const formatValue = (val: any) => {
  if (val === null) return '—'
  if (typeof val === 'boolean') return val ? '✅' : '❌'
  if (typeof val === 'object') return '[Object]'
  if (isDateField(String(val)) && !isNaN(new Date(val).getTime())) return new Date(val).toLocaleString()
  if (String(val).length > 50) return String(val).substring(0, 50) + '...'
  return val
}
const isDateField = (key: string) => key.includes('At') || key.includes('Date') || key.includes('_at')
const isLongText = (key: string) => key.includes('desc') || key.includes('content') || key.includes('Url') || key.includes('reason')

const openEditModal = (item: any) => {
  isEditing.value = true; const data = { ...item };
  for (const key in data) if (isDateField(key) && data[key]) try { data[key] = new Date(data[key]).toISOString().slice(0, 16) } catch(e) {}
  formData.value = data; showModal.value = true
}
const openCreateModal = () => {
  isEditing.value = false; formData.value = {}
  if (items.value.length > 0) Object.keys(items.value[0]).forEach(k => { if (k !== 'id' && typeof items.value[0][k] !== 'object') formData.value[k] = null })
  showModal.value = true
}
const deleteItem = async (id: number) => {
  if (!confirm('Are you sure?')) return;
  try { await $fetch('/api/admin/model', { method: 'POST', body: { model: currentModel.value, action: 'delete', id } }); showToast('Deleted', 'success'); fetchData() } catch (e) { showToast('Error', 'error') }
}
const saveItem = async () => {
  isSaving.value = true
  try {
    const payload = { ...formData.value }
    for (const key in payload) {
      if (isDateField(key) && payload[key]) payload[key] = new Date(payload[key]).toISOString()
      if (payload[key] === null || payload[key] === '') { delete payload[key]; continue }
      if (!isNaN(Number(payload[key])) && !isDateField(key) && payload[key] !== '') payload[key] = Number(payload[key])
    }
    await $fetch('/api/admin/model', { method: 'POST', body: { model: currentModel.value, action: isEditing.value ? 'update' : 'create', id: isEditing.value ? formData.value.id : undefined, data: payload } })
    showModal.value = false; showToast('Saved', 'success'); fetchData()
  } catch (e: any) { showToast(e.message, 'error') } finally { isSaving.value = false }
}
const logout = () => { useCookie('admin_token').value = null; navigateTo('/') }

onMounted(() => fetchData())
definePageMeta({ middleware: 'admin-auth', layout: false })
</script>