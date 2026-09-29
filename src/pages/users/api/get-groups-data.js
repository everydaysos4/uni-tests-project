import { api } from '../../../shared/api/axios';

export const getGroupsData = async (client = api) => {
  const response = await client.get('/groups');
  return response.data;
};
