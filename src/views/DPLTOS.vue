<template>
  <div class="has-sidebar flex min-h-screen bg-gray-50">
    <Sidebar :activeTab="activeTab" @change-tab="activeTab = $event" @logout="handleLogout" title="tOS DPL" />
    
    <div class="main-content-wrapper flex-1 min-h-screen">
      <main class="main-content">
        <div class="header flex items-center justify-between mb-8">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">工作台</h2>
            <p class="text-gray-500 mt-1">欢迎回来，tOS DPL管理员</p>
          </div>
          <button @click="openTaskModal" class="btn-primary flex items-center gap-2">
            <Plus class="w-5 h-5" />
            新建任务
          </button>
        </div>

        <div class="stats-grid grid grid-cols-4 gap-6 mb-8">
          <div class="stat-card">
            <div class="stat-icon bg-blue-100 text-blue-600">
              <Clock class="w-6 h-6" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.pending }}</div>
              <div class="stat-label">待处理任务</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bg-orange-100 text-orange-600">
              <Loader class="w-6 h-6" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.inProgress }}</div>
              <div class="stat-label">进行中任务</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bg-green-100 text-green-600">
              <CheckCircle class="w-6 h-6" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.completed }}</div>
              <div class="stat-label">已完成任务</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bg-purple-100 text-purple-600">
              <Users class="w-6 h-6" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stats.members }}</div>
              <div class="stat-label">团队成员</div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'dashboard'" class="card">
          <div class="card-header flex items-center justify-between">
            <span class="card-title">近期任务</span>
            <button @click="activeTab = 'board'" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
              查看全部 →
            </button>
          </div>
          <div class="task-list grid grid-cols-3 gap-6">
            <div class="task-column">
              <h3 class="column-title">待处理</h3>
              <div 
                v-for="task in pendingTasks" 
                :key="task.id" 
                class="task-item"
                @click="selectTask(task)"
              >
                <div class="task-title">{{ task.title }}</div>
                <div class="task-meta flex items-center gap-2 mt-2">
                  <span class="tag tag-date">{{ task.dueDate }}</span>
                </div>
                <div class="text-xs text-gray-500 mt-1">需要技能: {{ task.skills }}</div>
              </div>
            </div>
            <div class="task-column">
              <h3 class="column-title">进行中</h3>
              <div 
                v-for="task in inProgressTasks" 
                :key="task.id" 
                class="task-item"
                @click="selectTask(task)"
              >
                <div class="task-title">{{ task.title }}</div>
                <div class="task-meta flex items-center gap-2 mt-2">
                  <span class="tag tag-date">{{ task.dueDate }}</span>
                  <span class="text-gray-500 text-sm">{{ task.assignee }}</span>
                </div>
                <div class="progress-bar mt-3">
                  <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                </div>
                <div class="text-xs text-gray-500 mt-1">进度: {{ task.progress }}%</div>
              </div>
            </div>
            <div class="task-column">
              <h3 class="column-title">已完成</h3>
              <div 
                v-for="task in completedTasks" 
                :key="task.id" 
                class="task-item"
              >
                <div class="task-title line-through text-gray-400">{{ task.title }}</div>
                <div class="task-meta mt-2">
                  <span class="text-gray-400 text-sm">{{ task.completedDate }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'board'" class="mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800">任务看板</h2>
            <div class="flex gap-3">
              <button @click="openTaskModal" class="btn-primary flex items-center gap-2">
                <Plus class="w-5 h-5" />
                新建任务
              </button>
              <button @click="runSchedule" class="btn-success flex items-center gap-2">
                <Zap class="w-5 h-5" />
                一键排程
              </button>
              <button @click="clearScheduledTasks" class="btn-danger flex items-center gap-2">
                <Trash2 class="w-5 h-5" />
                清除已排任务
              </button>
            </div>
          </div>
          <div class="task-list grid grid-cols-3 gap-6">
            <div class="task-column">
              <h3 class="column-title">待处理</h3>
              <div 
                v-for="task in sortedPendingTasks" 
                :key="task.id" 
                class="task-item"
                @click="selectTask(task)"
              >
                <div class="task-title">{{ task.title }}</div>
                <div class="task-meta flex items-center gap-2 mt-2">
                  <span :class="getDateClass(task.dueDate)">{{ task.dueDate }}</span>
                </div>
                <div class="text-xs text-gray-500 mt-2">需要技能: {{ task.skills }}</div>
                <div class="text-xs text-gray-500">预计工时: {{ task.hours }}H</div>
              </div>
            </div>
            <div class="task-column">
              <h3 class="column-title">进行中</h3>
              <div 
                v-for="task in inProgressTasks" 
                :key="task.id" 
                class="task-item"
              >
                <div class="task-title">{{ task.title }}</div>
                <div class="task-meta flex items-center gap-2 mt-2">
                  <span :class="getDateClass(task.dueDate)">{{ task.dueDate }}</span>
                  <span class="text-gray-500 text-sm">负责人: {{ task.assignee }}</span>
                </div>
                <div class="progress-bar mt-3">
                  <div class="progress-fill" :style="{ width: task.progress + '%' }"></div>
                </div>
                <div class="text-xs text-gray-500 mt-1">进度: {{ task.progress }}%</div>
                <div class="flex gap-2 mt-3">
                  <button @click="markTaskCompleted(task)" class="btn-complete flex-1">
                    标记完成
                  </button>
                  <button @click="undoTaskToPending(task)" class="btn-undo">
                    撤销
                  </button>
                </div>
              </div>
            </div>
            <div class="task-column">
              <h3 class="column-title">已完成</h3>
              <div 
                v-for="task in completedTasks" 
                :key="task.id" 
                class="task-item"
              >
                <div class="task-title line-through text-gray-400">{{ task.title }}</div>
                <div class="task-meta mt-2">
                  <span class="text-gray-400 text-sm">负责人: {{ task.assignee }}</span>
                </div>
                <div class="text-xs text-gray-400 mt-1">完成日期: {{ task.completedDate }}</div>
                <button @click="undoTaskToInProgress(task)" class="btn-undo mt-3 w-full">
                  撤销
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'team'" class="mb-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-800">团队管理</h2>
            <div class="flex gap-3">
              <div class="relative">
                <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  v-model="searchKeyword" 
                  type="text" 
                  placeholder="搜索人员..." 
                  class="search-input"
                  @input="searchMember"
                />
              </div>
              <button @click="openMemberModal" class="btn-primary flex items-center gap-2">
                <UserPlus class="w-5 h-5" />
                添加成员
              </button>
            </div>
          </div>
          <div class="member-list grid grid-cols-3 gap-6">
            <div 
              v-for="member in filteredMembers" 
              :key="member.id" 
              class="member-card"
              :class="{ 'highlight': member.id === highlightedMemberId }"
            >
              <div class="member-avatar">{{ member.avatar }}</div>
              <div class="member-name">{{ member.name }}</div>
              <div class="member-role">{{ member.role }}</div>
              <div class="member-skills-header flex items-center justify-center gap-2 mt-3">
                <span class="text-xs text-gray-500">技能:</span>
                <button @click="openAddSkillModal(member)" class="btn-add-skill">
                  <Plus class="w-3 h-3" />
                </button>
              </div>
              <div class="member-skills flex flex-wrap gap-2 mt-2 justify-center">
                <span 
                  v-for="(skill, index) in member.skills" 
                  :key="index" 
                  class="skill-tag-wrapper"
                >
                  {{ skill }}
                  <button @click="removeSkill(member, index)" class="skill-remove-btn">
                    <X class="w-3 h-3" />
                  </button>
                </span>
                <span v-if="member.skills.length === 0" class="text-xs text-gray-400">暂无技能</span>
              </div>
              <div class="member-hours mt-4">
                <span class="text-gray-500 text-sm">今日工时:</span>
                <span :class="member.hours >= 8 ? 'text-amber-500' : 'text-green-500'" class="font-semibold ml-1">
                  {{ member.hours }}H / 8H
                </span>
              </div>
              <button @click="removeMember(member)" class="btn-remove mt-4 w-full">
                移除成员
              </button>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'reports'" class="space-y-6">
          <h2 class="text-xl font-semibold text-gray-800">数据报告</h2>
          
          <div class="card">
            <div class="card-header">
              <span class="card-title">任务完成趋势</span>
            </div>
            <div class="chart-container">
              <div 
                v-for="(item, index) in chartData" 
                :key="index" 
                class="chart-bar-wrapper"
              >
                <div class="chart-bar" :style="{ height: item.value + '%' }">
                  <div class="chart-bar-value">{{ item.count }}</div>
                </div>
                <div class="chart-bar-label">{{ item.label }}</div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <span class="card-title">人员工时统计</span>
            </div>
            <div class="overflow-x-auto">
              <table class="schedule-table w-full">
                <thead>
                  <tr>
                    <th>成员</th>
                    <th>已分配工时</th>
                    <th>剩余工时</th>
                    <th>使用率</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="member in teamMembers" :key="member.id">
                    <td>{{ member.name }}</td>
                    <td>{{ member.hours }}H</td>
                    <td>{{ 8 - member.hours }}H</td>
                    <td>
                      <div class="progress-bar">
                        <div class="progress-fill" :style="{ width: (member.hours / 8 * 100) + '%' }"></div>
                      </div>
                    </td>
                    <td>
                      <span :class="member.hours >= 8 ? 'tag-high' : 'tag-low'">
                        {{ member.hours >= 8 ? '已满' : '正常' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showTaskModal" class="modal-overlay" @click.self="closeTaskModal">
      <div class="modal">
        <h3>新建任务</h3>
        <div class="form-group">
          <label>任务名称</label>
          <input v-model="newTask.title" type="text" placeholder="请输入任务名称" />
        </div>
        <div class="form-group">
          <label>任务描述</label>
          <textarea v-model="newTask.description" placeholder="请输入任务描述"></textarea>
        </div>
        <div class="form-group">
          <label>时间节点</label>
          <input v-model="newTask.dueDate" type="date" />
        </div>
        <div class="form-group">
          <label>所需技能</label>
          <input v-model="newTask.skills" type="text" placeholder="请输入所需技能，用逗号分隔" />
        </div>
        <div class="form-group">
          <label>预计工时</label>
          <input v-model.number="newTask.hours" type="number" placeholder="预计工时（小时）" />
        </div>
        <div class="modal-actions">
          <button @click="closeTaskModal" class="btn-cancel">取消</button>
          <button @click="saveTask" class="btn-primary">保存</button>
        </div>
      </div>
    </div>

    <div v-if="showMemberModal" class="modal-overlay" @click.self="closeMemberModal">
      <div class="modal">
        <h3>添加成员</h3>
        <div class="form-group">
          <label>成员姓名</label>
          <input v-model="newMember.name" type="text" placeholder="请输入成员姓名" />
        </div>
        <div class="form-group">
          <label>职位</label>
          <input v-model="newMember.role" type="text" placeholder="请输入职位" />
        </div>
        <div class="form-group">
          <label>技能标签</label>
          <input v-model="newMember.skills" type="text" placeholder="请输入技能，用逗号分隔" />
        </div>
        <div class="modal-actions">
          <button @click="closeMemberModal" class="btn-cancel">取消</button>
          <button @click="saveMember" class="btn-primary">保存</button>
        </div>
      </div>
    </div>

    <div v-if="showAddSkillModal" class="modal-overlay" @click.self="closeAddSkillModal">
      <div class="modal">
        <h3>添加技能</h3>
        <div class="form-group">
          <label>技能名称</label>
          <input v-model="newSkillName" type="text" placeholder="请输入技能名称" />
        </div>
        <div class="modal-actions">
          <button @click="closeAddSkillModal" class="btn-cancel">取消</button>
          <button @click="addSkillToMember" class="btn-primary">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Zap, UserPlus, Clock, Loader, CheckCircle, Users, Search, Trash2, X } from 'lucide-vue-next'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const activeTab = ref('dashboard')

const currentDate = new Date().toISOString().split('T')[0]
const todayStr = new Date().toISOString().split('T')[0]

const stats = ref({
  pending: 6,
  inProgress: 4,
  completed: 12,
  members: 4
})

const pendingTasks = ref([
  { id: 1, title: 'tOS系统版本升级', dueDate: '2024-01-15', skills: '系统升级', hours: 8 },
  { id: 2, title: '性能优化测试', dueDate: '2024-01-17', skills: '性能测试', hours: 6 },
  { id: 3, title: '安全漏洞修复', dueDate: '2024-01-13', skills: '安全开发', hours: 4 }
])

const inProgressTasks = ref([
  { id: 4, title: '数据库迁移', dueDate: '2024-01-18', assignee: '钱八', progress: 75, originalSkills: '数据库', originalHours: 8 },
  { id: 5, title: 'API接口开发', dueDate: '2024-01-21', assignee: '周九', progress: 40, originalSkills: 'API开发', originalHours: 6 }
])

const completedTasks = ref([
  { id: 6, title: '需求文档编写', assignee: '吴十', completedDate: todayStr, dueDate: '2024-01-10', progress: 100, originalSkills: '需求分析', originalHours: 4 },
  { id: 7, title: '环境搭建', assignee: '郑十一', completedDate: todayStr, dueDate: '2024-01-11', progress: 100, originalSkills: '环境配置', originalHours: 4 }
])

const teamMembers = ref([
  { id: 1, name: '钱八', role: '系统工程师', avatar: '钱', skills: ['系统升级', 'Linux', '运维'], hours: 5 },
  { id: 2, name: '周九', role: '后端开发', avatar: '周', skills: ['API开发', '数据库', 'Java'], hours: 7 },
  { id: 3, name: '吴十', role: '产品经理', avatar: '吴', skills: ['需求分析', '文档编写'], hours: 3 },
  { id: 4, name: '郑十一', role: '测试工程师', avatar: '郑', skills: ['功能测试', '安全测试'], hours: 6 }
])

const chartData = ref([
  { label: '周一', value: 50, count: 10 },
  { label: '周二', value: 70, count: 14 },
  { label: '周三', value: 55, count: 11 },
  { label: '周四', value: 85, count: 17 },
  { label: '周五', value: 65, count: 13 }
])

const showTaskModal = ref(false)
const showMemberModal = ref(false)
const showAddSkillModal = ref(false)
const searchKeyword = ref('')
const highlightedMemberId = ref(null)
const selectedMemberForSkill = ref(null)
const newSkillName = ref('')

const newTask = ref({
  title: '',
  description: '',
  dueDate: currentDate,
  skills: '',
  hours: 0
})

const newMember = ref({
  name: '',
  role: '',
  skills: ''
})

const sortedPendingTasks = computed(() => {
  return [...pendingTasks.value].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
})

const filteredMembers = computed(() => {
  if (!searchKeyword.value) return teamMembers.value
  return teamMembers.value.filter(member => 
    member.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const getDateClass = (date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const taskDate = new Date(date)
  
  const diffDays = Math.ceil((taskDate - today) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'tag tag-expired'
  if (diffDays === 0) return 'tag tag-today'
  if (diffDays <= 2) return 'tag tag-high'
  if (diffDays <= 5) return 'tag tag-medium'
  return 'tag tag-low'
}

const openTaskModal = () => {
  newTask.value.dueDate = currentDate
  showTaskModal.value = true
}

const closeTaskModal = () => {
  showTaskModal.value = false
  newTask.value = { title: '', description: '', dueDate: currentDate, skills: '', hours: 0 }
}

const saveTask = () => {
  if (!newTask.value.title) {
    alert('请输入任务名称')
    return
  }
  if (!newTask.value.dueDate) {
    alert('请选择时间节点')
    return
  }
  
  const task = {
    id: Date.now(),
    title: newTask.value.title,
    description: newTask.value.description,
    dueDate: newTask.value.dueDate,
    skills: newTask.value.skills,
    hours: newTask.value.hours || 0
  }
  
  pendingTasks.value.push(task)
  stats.value.pending = pendingTasks.value.length
  
  alert('任务已创建成功！')
  closeTaskModal()
}

const openMemberModal = () => {
  showMemberModal.value = true
}

const closeMemberModal = () => {
  showMemberModal.value = false
  newMember.value = { name: '', role: '', skills: '' }
}

const saveMember = () => {
  if (!newMember.value.name) {
    alert('请输入成员姓名')
    return
  }
  
  const member = {
    id: Date.now(),
    name: newMember.value.name,
    role: newMember.value.role || '未指定',
    avatar: newMember.value.name.charAt(0),
    skills: newMember.value.skills ? newMember.value.skills.split(',').map(s => s.trim()) : [],
    hours: 0
  }
  
  teamMembers.value.push(member)
  stats.value.members = teamMembers.value.length
  
  alert('成员已添加成功！')
  closeMemberModal()
}

const removeMember = (member) => {
  if (confirm(`确定要移除成员「${member.name}」吗？`)) {
    const index = teamMembers.value.findIndex(m => m.id === member.id)
    if (index !== -1) {
      teamMembers.value.splice(index, 1)
      stats.value.members = teamMembers.value.length
      alert(`成员「${member.name}」已移除！`)
    }
  }
}

const searchMember = () => {
  if (searchKeyword.value) {
    const found = teamMembers.value.find(m => 
      m.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
    if (found) {
      highlightedMemberId.value = found.id
      setTimeout(() => {
        const element = document.querySelector(`[data-member-id="${found.id}"]`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  } else {
    highlightedMemberId.value = null
  }
}

const selectTask = (task) => {
  console.log('选择任务:', task)
}

const markTaskCompleted = (task) => {
  const taskIndex = inProgressTasks.value.findIndex(t => t.id === task.id)
  if (taskIndex !== -1) {
    const completedTask = {
      ...task,
      completedDate: todayStr,
      progress: 100
    }
    completedTasks.value.push(completedTask)
    inProgressTasks.value.splice(taskIndex, 1)
    
    stats.value.inProgress = inProgressTasks.value.length
    stats.value.completed = completedTasks.value.length
    
    alert(`任务「${task.title}」已标记为完成！`)
  }
}

const undoTaskToPending = (task) => {
  const taskIndex = inProgressTasks.value.findIndex(t => t.id === task.id)
  if (taskIndex !== -1) {
    const pendingTask = {
      id: task.id,
      title: task.title,
      dueDate: task.dueDate,
      skills: task.originalSkills || task.skills || '',
      hours: task.originalHours || task.hours || 0
    }
    pendingTasks.value.push(pendingTask)
    inProgressTasks.value.splice(taskIndex, 1)
    
    stats.value.pending = pendingTasks.value.length
    stats.value.inProgress = inProgressTasks.value.length
    
    alert(`任务「${task.title}」已撤销到待处理！`)
  }
}

const undoTaskToInProgress = (task) => {
  const taskIndex = completedTasks.value.findIndex(t => t.id === task.id)
  if (taskIndex !== -1) {
    const inProgressTask = {
      ...task,
      completedDate: undefined,
      progress: 0
    }
    inProgressTasks.value.push(inProgressTask)
    completedTasks.value.splice(taskIndex, 1)
    
    stats.value.inProgress = inProgressTasks.value.length
    stats.value.completed = completedTasks.value.length
    
    alert(`任务「${task.title}」已撤销到进行中！`)
  }
}

const clearScheduledTasks = () => {
  if (confirm('确定要清除所有已排任务吗？（进行中和已完成的任务将被清空）')) {
    inProgressTasks.value = []
    completedTasks.value = []
    stats.value.inProgress = 0
    stats.value.completed = 0
    alert('已清除所有已排任务！')
  }
}

const runSchedule = () => {
  const assignedTasks = []
  const unassignedTasks = []
  const remainingTasks = [...pendingTasks.value]
  
  remainingTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  
  const availableMembers = teamMembers.value
    .filter(m => m.hours < 8)
    .map(m => ({ ...m }))
  
  availableMembers.sort((a, b) => a.skills.length - b.skills.length)
  
  for (const task of remainingTasks) {
    const taskSkills = task.skills.split(',').map(s => s.trim()).filter(s => s)
    if (taskSkills.length === 0) {
      unassignedTasks.push(task)
      continue
    }
    
    let assigned = false
    for (const member of availableMembers) {
      const hasAllSkills = taskSkills.every(skill => 
        member.skills.some(memberSkill => 
          memberSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(memberSkill.toLowerCase())
        )
      )
      
      if (hasAllSkills && member.hours + (task.hours || 0) <= 8) {
        const taskIndex = pendingTasks.value.findIndex(t => t.id === task.id)
        if (taskIndex !== -1) {
          const inProgressTask = {
            ...task,
            assignee: member.name,
            progress: 0,
            originalSkills: task.skills,
            originalHours: task.hours
          }
          inProgressTasks.value.push(inProgressTask)
          pendingTasks.value.splice(taskIndex, 1)
          
          member.hours += (task.hours || 0)
          assignedTasks.push({ task: task.title, member: member.name })
          assigned = true
          break
        }
      }
    }
    
    if (!assigned) {
      unassignedTasks.push(task)
    }
  }
  
  stats.value.pending = pendingTasks.value.length
  stats.value.inProgress = inProgressTasks.value.length
  
  let message = '排程完成！\n\n'
  if (assignedTasks.length > 0) {
    message += `已成功分配 ${assignedTasks.length} 项任务：\n`
    assignedTasks.forEach((item, index) => {
      message += `${index + 1}. ${item.task} → ${item.member}\n`
    })
  }
  if (unassignedTasks.length > 0) {
    message += `\n有 ${unassignedTasks.length} 项任务未分配：\n`
    unassignedTasks.forEach((task, index) => {
      message += `${index + 1}. ${task.title}\n`
    })
    message += '\n原因：技能不匹配或人员工时已满，请调整人员技能库或分配更多人员'
  }
  
  alert(message)
}

const openAddSkillModal = (member) => {
  selectedMemberForSkill.value = member
  newSkillName.value = ''
  showAddSkillModal.value = true
}

const closeAddSkillModal = () => {
  showAddSkillModal.value = false
  selectedMemberForSkill.value = null
  newSkillName.value = ''
}

const addSkillToMember = () => {
  if (!newSkillName.value.trim()) {
    alert('请输入技能名称')
    return
  }
  
  if (selectedMemberForSkill.value) {
    if (!selectedMemberForSkill.value.skills.includes(newSkillName.value.trim())) {
      selectedMemberForSkill.value.skills.push(newSkillName.value.trim())
      alert(`技能「${newSkillName.value.trim()}」已添加！`)
    } else {
      alert('该技能已存在')
    }
  }
  closeAddSkillModal()
}

const removeSkill = (member, index) => {
  if (confirm('确定要删除该技能吗？')) {
    member.skills.splice(index, 1)
  }
}

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('userRole')
  router.push('/')
}

onMounted(() => {
  const storedDate = localStorage.getItem('completedTasksDate')
  if (storedDate !== todayStr) {
    completedTasks.value = []
    localStorage.setItem('completedTasksDate', todayStr)
  }
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium;
}

.btn-success {
  @apply px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium;
}

.btn-danger {
  @apply px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium;
}

.btn-complete {
  @apply px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium;
}

.btn-undo {
  @apply px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium;
}

.btn-remove {
  @apply px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium;
}

.btn-add-skill {
  @apply w-5 h-5 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center hover:bg-primary-100 transition-colors;
}

.search-input {
  @apply pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64;
}

.stat-card {
  @apply bg-white rounded-xl p-5 shadow-sm flex items-center gap-4;
}

.stat-icon {
  @apply w-12 h-12 rounded-lg flex items-center justify-center;
}

.stat-value {
  @apply text-2xl font-bold text-gray-800;
}

.stat-label {
  @apply text-sm text-gray-500;
}

.card {
  @apply bg-white rounded-xl shadow-sm;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-100;
}

.card-title {
  @apply text-lg font-semibold text-gray-800;
}

.task-column {
  @apply bg-gray-100 rounded-xl p-4;
}

.column-title {
  @apply text-sm font-semibold text-gray-600 pb-3 border-b-2 border-gray-300 mb-4;
}

.task-item {
  @apply bg-white rounded-lg p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow;
}

.task-title {
  @apply font-medium text-gray-800;
}

.tag {
  @apply px-2 py-0.5 rounded text-xs font-medium;
}

.tag-high {
  @apply bg-red-100 text-red-600;
}

.tag-medium {
  @apply bg-amber-100 text-amber-600;
}

.tag-low {
  @apply bg-green-100 text-green-600;
}

.tag-date {
  @apply bg-blue-100 text-blue-600;
}

.tag-today {
  @apply bg-purple-100 text-purple-600;
}

.tag-expired {
  @apply bg-gray-100 text-gray-500 line-through;
}

.progress-bar {
  @apply h-2 bg-gray-200 rounded-full overflow-hidden;
}

.progress-fill {
  @apply h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all;
}

.member-card {
  @apply bg-white rounded-xl p-5 text-center transition-all duration-300;
}

.member-card.highlight {
  @apply ring-2 ring-primary-500 shadow-lg;
}

.member-avatar {
  @apply w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 text-white text-xl font-bold flex items-center justify-center mb-3;
}

.member-name {
  @apply font-semibold text-gray-800;
}

.member-role {
  @apply text-sm text-gray-500;
}

.skill-tag-wrapper {
  @apply px-2 py-1 bg-primary-50 text-primary-600 rounded text-xs flex items-center gap-1;
}

.skill-remove-btn {
  @apply text-primary-400 hover:text-red-500 transition-colors;
}

.chart-container {
  @apply flex items-end justify-around h-64 p-6;
}

.chart-bar-wrapper {
  @apply flex-1 flex flex-col items-center;
}

.chart-bar {
  @apply w-full max-w-16 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg relative transition-all duration-500;
  min-height: 40px;
}

.chart-bar-value {
  @apply absolute -top-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700;
}

.chart-bar-label {
  @apply mt-3 text-sm text-gray-500;
}

.schedule-table {
  @apply border-collapse;
}

.schedule-table th,
.schedule-table td {
  @apply border border-gray-200 px-4 py-3 text-left;
}

.schedule-table th {
  @apply bg-gray-50 font-semibold text-gray-700;
}

.schedule-table tr:hover {
  @apply bg-gray-50;
}

.modal-overlay {
  @apply fixed inset-0 bg-black/50 flex items-center justify-center z-50;
}

.modal {
  @apply bg-white rounded-xl p-6 w-full max-w-md mx-4;
}

.modal h3 {
  @apply text-xl font-semibold text-gray-800 mb-4;
}

.form-group {
  @apply mb-4;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 mb-2;
}

.form-group input,
.form-group select,
.form-group textarea {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent;
}

.form-group textarea {
  @apply resize-none min-h-[80px];
}

.modal-actions {
  @apply flex justify-end gap-3 mt-6;
}

.btn-cancel {
  @apply px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors font-medium;
}
</style>
