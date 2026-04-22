const mockTasks = {
  machine: [
    {
      id: '1',
      title: '元宇宙风格主视觉海报设计',
      description: '需要为本次夏季战役设计一套极具"元宇宙"和"数字生命"质感的主视觉系统',
      priority: 'high',
      status: 'todo',
      dueDate: '2026-04-12T00:00:00Z',
      estimatedHours: 8,
      skills: ['视觉设计', 'C4D', 'Figma'],
      tags: ['视觉设计'],
      role: 'machine',
      createdAt: '2026-04-01T00:00:00Z',
      updatedAt: '2026-04-01T00:00:00Z'
    },
    {
      id: '2',
      title: 'H5互动页面动画效果实现',
      description: '实现夏季战役H5互动页面的动画效果，包括滚动触发、3D转场等',
      priority: 'high',
      status: 'in_progress',
      dueDate: '2026-04-10T00:00:00Z',
      estimatedHours: 12,
      skills: ['React', 'Three.js', 'UI动效'],
      tags: ['前端开发'],
      role: 'machine',
      createdAt: '2026-04-03T00:00:00Z',
      updatedAt: '2026-04-08T00:00:00Z'
    },
    {
      id: '3',
      title: '品牌升级色值表复核',
      description: '复核并更新品牌升级后的色值表，确保所有设计资产使用正确的色彩规范',
      priority: 'medium',
      status: 'completed',
      dueDate: '2026-04-09T00:00:00Z',
      estimatedHours: 2,
      skills: ['视觉设计', 'Figma'],
      tags: ['视觉设计'],
      role: 'machine',
      createdAt: '2026-04-04T00:00:00Z',
      updatedAt: '2026-04-09T00:00:00Z'
    }
  ],
  tos: [
    {
      id: '101',
      title: 'tOS系统界面优化',
      description: '优化tOS系统的用户界面，提升用户体验',
      priority: 'high',
      status: 'todo',
      dueDate: '2026-04-15T00:00:00Z',
      estimatedHours: 16,
      skills: ['UI设计', 'Vue', 'TypeScript'],
      tags: ['前端开发'],
      role: 'tos',
      createdAt: '2026-04-01T00:00:00Z',
      updatedAt: '2026-04-01T00:00:00Z'
    },
    {
      id: '102',
      title: 'API接口文档更新',
      description: '更新tOS系统的API接口文档',
      priority: 'medium',
      status: 'in_progress',
      dueDate: '2026-04-12T00:00:00Z',
      estimatedHours: 4,
      skills: ['技术文档', 'API设计'],
      tags: ['文档'],
      role: 'tos',
      createdAt: '2026-04-02T00:00:00Z',
      updatedAt: '2026-04-08T00:00:00Z'
    }
  ]
};

const mockMembers = {
  machine: [
    {
      id: '1',
      name: '赵美玲',
      role: '资深UI设计师',
      avatar: '赵',
      status: 'online',
      skills: ['Figma', 'C4D', '视觉设计'],
      skillLevels: { Figma: 95, C4D: 80, '视觉设计': 90 },
      weeklyCapacity: 8,
      currentLoad: 5.2,
      createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: '张小龙',
      role: '交互开发工程师',
      avatar: '张',
      status: 'busy',
      skills: ['React', 'Three.js', 'JavaScript'],
      skillLevels: { React: 98, 'Three.js': 95, JavaScript: 96 },
      weeklyCapacity: 8,
      currentLoad: 7.36,
      createdAt: '2026-01-02T00:00:00Z'
    }
  ],
  tos: [
    {
      id: '101',
      name: '李明',
      role: '高级前端工程师',
      avatar: '李',
      status: 'online',
      skills: ['Vue', 'TypeScript', 'Node.js'],
      skillLevels: { Vue: 95, TypeScript: 90, 'Node.js': 85 },
      weeklyCapacity: 8,
      currentLoad: 4,
      createdAt: '2026-01-01T00:00:00Z'
    }
  ]
};

let tasksData = { ...mockTasks };
let membersData = { ...mockMembers };

export const cloudbaseService = {
  async getTasks(role = 'machine') {
    return tasksData[role] || [];
  },

  async addTask(task) {
    const role = task.role || 'machine';
    if (!tasksData[role]) tasksData[role] = [];
    tasksData[role].push(task);
    return { id: task.id };
  },

  async updateTask(taskId, updates) {
    const roles = ['machine', 'tos'];
    for (const role of roles) {
      const taskIndex = tasksData[role]?.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        tasksData[role][taskIndex] = { ...tasksData[role][taskIndex], ...updates };
        break;
      }
    }
    return { updated: true };
  },

  async deleteTask(taskId) {
    const roles = ['machine', 'tos'];
    for (const role of roles) {
      tasksData[role] = tasksData[role]?.filter(t => t.id !== taskId) || [];
    }
    return { deleted: true };
  },

  async getMembers(role = 'machine') {
    return membersData[role] || [];
  },

  async addMember(member) {
    const role = member.role || 'machine';
    if (!membersData[role]) membersData[role] = [];
    membersData[role].push(member);
    return { id: member.id };
  },

  async updateMember(memberId, updates) {
    const roles = ['machine', 'tos'];
    for (const role of roles) {
      const memberIndex = membersData[role]?.findIndex(m => m.id === memberId);
      if (memberIndex !== -1) {
        membersData[role][memberIndex] = { ...membersData[role][memberIndex], ...updates };
        break;
      }
    }
    return { updated: true };
  },

  async deleteMember(memberId) {
    const roles = ['machine', 'tos'];
    for (const role of roles) {
      membersData[role] = membersData[role]?.filter(m => m.id !== memberId) || [];
    }
    return { deleted: true };
  }
};

export default cloudbaseService;