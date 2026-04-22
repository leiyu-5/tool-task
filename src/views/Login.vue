<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary-100 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-100 rounded-full blur-3xl"></div>
    </div>
    
    <div class="relative z-10 w-full max-w-md mx-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div class="text-center">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl mb-4">
            <ClipboardList class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-gray-800">智能任务排程系统</h1>
          <p class="text-gray-500 mt-2">请选择您的登录身份</p>
        </div>
        
        <div class="space-y-4">
          <button
            @click="login('machine')"
            class="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Cpu class="w-6 h-6" />
            </div>
            <div class="text-left">
              <div class="font-semibold">整机DPL</div>
              <div class="text-sm text-blue-100">负责整机相关任务管理</div>
            </div>
          </button>
          
          <button
            @click="login('tos')"
            class="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <HardDrive class="w-6 h-6" />
            </div>
            <div class="text-left">
              <div class="font-semibold">tOS DPL</div>
              <div class="text-sm text-green-100">负责tOS相关任务管理</div>
            </div>
          </button>
        </div>
        
        <div class="pt-4 border-t border-gray-100">
          <p class="text-center text-gray-400 text-sm">
            登录后将进入对应模块的任务管理界面
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ClipboardList, Cpu, HardDrive } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

const login = (role) => {
  localStorage.setItem('isAuthenticated', 'true')
  localStorage.setItem('userRole', role)
  
  if (role === 'machine') {
    router.push('/dpl-machine')
  } else {
    router.push('/dpl-tos')
  }
}
</script>
