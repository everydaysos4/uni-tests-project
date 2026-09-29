import { act, renderHook } from '@testing-library/react';
import toast from 'react-hot-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useUsersState } from '../../src/pages/users/hooks/useUsersState';
import { users } from '../fixtures/users';

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useUsersState', () => {
  beforeEach(() => {
    toast.success.mockReset();
    toast.error.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('добавляет и удаляет пользователя через внедрённый API', async () => {
    const addedUser = { ...users[0], id: 20, username: 'new-user' };
    const api = {
      addUser: vi.fn().mockResolvedValue(addedUser),
      deleteUser: vi.fn().mockResolvedValue(undefined),
    };
    const { result } = renderHook(() => useUsersState(api));

    await act(() => result.current.handleAddUser(addedUser));
    expect(result.current.users).toEqual([addedUser]);
    expect(toast.success).toHaveBeenCalledWith('Пользователь new-user добавлен');

    await act(() => result.current.handleDeleteUser(20));
    expect(result.current.users).toEqual([]);
    expect(toast.success).toHaveBeenCalledWith('Пользователь new-user удалён');
  });

  it('пробрасывает ошибку добавления и не меняет список', async () => {
    const error = new Error('add failed');
    const api = { addUser: vi.fn().mockRejectedValue(error) };
    const { result } = renderHook(() => useUsersState(api));

    await expect(act(() => result.current.handleAddUser(users[0]))).rejects.toBe(error);
    expect(result.current.users).toEqual([]);
    expect(toast.error).toHaveBeenCalledWith('Не удалось добавить пользователя boris.volkov');
  });

  it('при ошибке удаления оставляет список без изменений', async () => {
    const api = { deleteUser: vi.fn().mockRejectedValue(new Error('delete failed')) };
    const { result } = renderHook(() => useUsersState(api));

    act(() => result.current.setUsers(users));
    await act(() => result.current.handleDeleteUser(1));

    expect(result.current.users).toEqual(users);
    expect(toast.error).toHaveBeenCalledWith('Не удалось удалить пользователя boris.volkov');
  });
});
