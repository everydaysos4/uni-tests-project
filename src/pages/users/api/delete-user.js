import { api } from '../../../shared/api/axios';

export const deleteUser = async (userId, client = api) => {
  await client.delete(`/users/${userId}`);
};
