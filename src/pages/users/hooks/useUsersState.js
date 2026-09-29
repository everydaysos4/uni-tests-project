import toast from 'react-hot-toast';
import { usersApi } from '../api/users-api';
import { useState } from 'react';

export const useUsersState = (api = usersApi) => {
  const [users, setUsers] = useState([]);
  const handleDeleteUser = async (userId) => {
    const username = users.find((user) => user.id === userId)?.username;

    try {
      await api.deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast.success(`Пользователь ${username} удалён`);
    } catch (err) {
      toast.error(`Не удалось удалить пользователя ${username}`);
      console.error('Error deleting user:', err);
    }
  };

  const handleAddUser = async (payload) => {
    try {
      const newUserData = await api.addUser(payload);
      setUsers((prevUsers) => [...prevUsers, newUserData]);
      toast.success(`Пользователь ${payload.username} добавлен`);
    } catch (err) {
      toast.error(`Не удалось добавить пользователя ${payload.username}`);
      console.error('Error adding user:', err);
      throw err;
    }
  };

  return {
    users,
    setUsers,
    handleDeleteUser,
    handleAddUser,
  };
};
