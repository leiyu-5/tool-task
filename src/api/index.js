import { cloudbaseService } from './cloudbase';

const getCurrentRole = () => {
  return localStorage.getItem('userRole') || 'machine';
};

export const taskAPI = {
  async getTasks() {
    const role = getCurrentRole();
    const tasks = await cloudbaseService.getTasks(role);
    return { data: tasks };
  },

  async getTask(id) {
    const tasks = await cloudbaseService.getTasks(getCurrentRole());
    const task = tasks.find(t => t.id === id);
    return { data: task };
  },

  async createTask(data) {
    const role = getCurrentRole();
    const task = {
      ...data,
      role,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await cloudbaseService.addTask(task);
    return { data: task };
  },

  async updateTask(id, data) {
    const updates = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    await cloudbaseService.updateTask(id, updates);
    return { data: { id, ...updates } };
  },

  async deleteTask(id) {
    await cloudbaseService.deleteTask(id);
    return { data: { id } };
  },

  async runSchedule() {
    return { data: { success: true, message: '排程完成' } };
  }
};

export const memberAPI = {
  async getMembers() {
    const role = getCurrentRole();
    const members = await cloudbaseService.getMembers(role);
    return { data: members };
  },

  async getMember(id) {
    const members = await cloudbaseService.getMembers(getCurrentRole());
    const member = members.find(m => m.id === id);
    return { data: member };
  },

  async createMember(data) {
    const role = getCurrentRole();
    const member = {
      ...data,
      role,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    await cloudbaseService.addMember(member);
    return { data: member };
  },

  async updateMember(id, data) {
    await cloudbaseService.updateMember(id, data);
    return { data: { id, ...data } };
  },

  async deleteMember(id) {
    await cloudbaseService.deleteMember(id);
    return { data: { id } };
  }
};

export const authAPI = {
  async login(data) {
    localStorage.setItem('token', 'mock-token');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', data.role);
    return { data: { token: 'mock-token', role: data.role } };
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    return { data: { success: true } };
  },

  async refreshToken() {
    return { data: { token: 'mock-token' } };
  }
};

export const reportAPI = {
  async getTaskTrend(params) {
    const role = getCurrentRole();
    const tasks = await cloudbaseService.getTasks(role);
    const trend = {
      labels: ['周一', '周二', '周三', '周四', '周五'],
      completed: [3, 5, 2, 7, 4],
      inProgress: [2, 3, 4, 2, 3],
      todo: [5, 2, 3, 1, 2]
    };
    return { data: trend };
  },

  async getWorkloadStats() {
    const role = getCurrentRole();
    const members = await cloudbaseService.getMembers(role);
    const stats = members.map(member => ({
      name: member.name,
      workload: Math.round((member.currentLoad / member.weeklyCapacity) * 100),
      tasks: Math.floor(Math.random() * 5) + 1
    }));
    return { data: stats };
  }
};

export default { taskAPI, memberAPI, authAPI, reportAPI };