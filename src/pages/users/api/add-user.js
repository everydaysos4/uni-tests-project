import { api } from '../../../shared/api/axios';

export const addUser = async (userData, client = api) => {
  const response = await client.post('/users', userData);
  return response.data;
};
