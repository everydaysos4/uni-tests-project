import { api } from '../../../shared/api/axios';

export class UsersApi {
  constructor(client) {
    this.client = client;
  }

  async getUsers() {
    const response = await this.client.get('/users');
    return response.data;
  }

  async getGroups() {
    const response = await this.client.get('/groups');
    return response.data;
  }

  async addUser(userData) {
    const response = await this.client.post('/users', userData);
    return response.data;
  }

  async deleteUser(userId) {
    await this.client.delete(`/users/${userId}`);
  }
}

export const usersApi = new UsersApi(api);
