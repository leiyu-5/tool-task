import cloudbase from '@cloudbase/js-sdk';

const envId = 'test111-5gj0f8rba9c312c';

const app = cloudbase.init({
  env: envId
});

const db = app.database();

export const cloudbaseService = {
  app,
  db,
  
  async getTasks(role = 'machine') {
    try {
      const result = await db.collection('tasks').where({
        role: role
      }).get();
      return result.data;
    } catch (error) {
      console.error('获取任务失败:', error);
      return [];
    }
  },

  async addTask(task) {
    try {
      const result = await db.collection('tasks').add(task);
      return result;
    } catch (error) {
      console.error('添加任务失败:', error);
      throw error;
    }
  },

  async updateTask(taskId, updates) {
    try {
      const result = await db.collection('tasks').doc(taskId).update(updates);
      return result;
    } catch (error) {
      console.error('更新任务失败:', error);
      throw error;
    }
  },

  async deleteTask(taskId) {
    try {
      const result = await db.collection('tasks').doc(taskId).remove();
      return result;
    } catch (error) {
      console.error('删除任务失败:', error);
      throw error;
    }
  },

  async getMembers(role = 'machine') {
    try {
      const result = await db.collection('members').where({
        role: role
      }).get();
      return result.data;
    } catch (error) {
      console.error('获取成员失败:', error);
      return [];
    }
  },

  async addMember(member) {
    try {
      const result = await db.collection('members').add(member);
      return result;
    } catch (error) {
      console.error('添加成员失败:', error);
      throw error;
    }
  },

  async updateMember(memberId, updates) {
    try {
      const result = await db.collection('members').doc(memberId).update(updates);
      return result;
    } catch (error) {
      console.error('更新成员失败:', error);
      throw error;
    }
  },

  async deleteMember(memberId) {
    try {
      const result = await db.collection('members').doc(memberId).remove();
      return result;
    } catch (error) {
      console.error('删除成员失败:', error);
      throw error;
    }
  }
};

export default cloudbaseService;