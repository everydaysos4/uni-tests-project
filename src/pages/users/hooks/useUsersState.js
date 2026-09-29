import toast from 'react-hot-toast';
import { addUser } from '../api/add-user';
import { deleteUser } from '../api/delete-user';
import { useState } from 'react';

const userActions = { addUser, deleteUser };

export const useUsersState = (actions = userActions) => {
  const [users, setUsers] = useState([]);
  const handleDeleteUser = async (userId) => {
    const username = users.find((user) => user.id === userId)?.username;

    try {
      await actions.deleteUser(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      toast.success(`Пользователь ${username} удалён`);
    } catch (err) {
      toast.error(`Не удалось удалить пользователя ${username}`);
      console.error('Error deleting user:', err);
    }
  };

  const handleAddUser = async (payload) => {
    try {
      const newUserData = await actions.addUser(payload);
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
