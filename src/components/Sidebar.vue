<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <ClipboardList class="w-8 h-8" />
        <span>{{ title }}</span>
      </div>
    </div>
    
    <nav class="sidebar-nav">
      <button 
        v-for="item in menuItems" 
        :key="item.id"
        @click="$emit('change-tab', item.id)"
        :class="['nav-item', { active: activeTab === item.id }]"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </button>
    </nav>
    
    <div class="sidebar-footer">
      <button @click="$emit('logout')" class="logout-btn">
        <LogOut class="w-5 h-5" />
        <span>退出登录</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ClipboardList, LayoutDashboard, Kanban, Users, BarChart3, LogOut } from 'lucide-vue-next'

defineProps({
  activeTab: {
    type: String,
    default: 'dashboard'
  },
  title: {
    type: String,
    default: '智能任务排程'
  }
})

defineEmits(['change-tab', 'logout'])

const menuItems = [
  { id: 'dashboard', label: '工作台', icon: LayoutDashboard },
  { id: 'board', label: '任务看板', icon: Kanban },
  { id: 'team', label: '团队管理', icon: Users },
  { id: 'reports', label: '数据报告', icon: BarChart3 }
]
</script>

<style scoped>
.sidebar {
  @apply fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white flex flex-col;
}

.sidebar-header {
  @apply p-6 border-b border-gray-700;
}

.logo {
  @apply flex items-center gap-3 text-xl font-bold;
}

.sidebar-nav {
  @apply flex-1 p-4 space-y-2;
}

.nav-item {
  @apply w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors;
}

.nav-item.active {
  @apply bg-primary-600 text-white;
}

.sidebar-footer {
  @apply p-4 border-t border-gray-700;
}

.logout-btn {
  @apply w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-600 hover:text-white transition-colors;
}
</style>
