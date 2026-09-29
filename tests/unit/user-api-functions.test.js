import { describe, expect, it, vi } from 'vitest';
import { addUser } from '../../src/pages/users/api/add-user';
import { deleteUser } from '../../src/pages/users/api/delete-user';
import { getGroupsData } from '../../src/pages/users/api/get-groups-data';
import { getUsersData } from '../../src/pages/users/api/get-users-data';

describe('функции API пользователей', () => {
  it('получает пользователей и группы через подменённый HTTP-клиент', async () => {
    const client = {
      get: vi
        .fn()
        .mockResolvedValueOnce({ data: ['user'] })
        .mockResolvedValueOnce({ data: ['group'] }),
    };

    await expect(getUsersData(client)).resolves.toEqual(['user']);
    await expect(getGroupsData(client)).resolves.toEqual(['group']);
    expect(client.get).toHaveBeenNthCalledWith(1, '/users');
    expect(client.get).toHaveBeenNthCalledWith(2, '/groups');
  });

  it('добавляет и удаляет пользователя через подменённый HTTP-клиент', async () => {
    const payload = { username: 'new-user' };
    const savedUser = { id: 10, ...payload };
    const client = {
      post: vi.fn().mockResolvedValue({ data: savedUser }),
      delete: vi.fn().mockResolvedValue(undefined),
    };

    await expect(addUser(payload, client)).resolves.toEqual(savedUser);
    await expect(deleteUser(10, client)).resolves.toBeUndefined();
    expect(client.post).toHaveBeenCalledWith('/users', payload);
    expect(client.delete).toHaveBeenCalledWith('/users/10');
  });
});
