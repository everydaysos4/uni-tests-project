import { api } from '../../../shared/api/axios';

export const getUsersData = async (client = api) => {
  const response = await client.get('/users');
  return response.data;
};
