import { describe, expect, it, vi } from 'vitest';
import { UsersApi } from '../../src/pages/users/api/users-api';

describe('UsersApi', () => {
  it('получает пользователей и группы через подменённый HTTP-клиент', async () => {
    const client = {
      get: vi
        .fn()
        .mockResolvedValueOnce({ data: ['user'] })
        .mockResolvedValueOnce({ data: ['group'] }),
    };
    const api = new UsersApi(client);

    await expect(api.getUsers()).resolves.toEqual(['user']);
    await expect(api.getGroups()).resolves.toEqual(['group']);
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
    const api = new UsersApi(client);

    await expect(api.addUser(payload)).resolves.toEqual(savedUser);
    await expect(api.deleteUser(10)).resolves.toBeUndefined();
    expect(client.post).toHaveBeenCalledWith('/users', payload);
    expect(client.delete).toHaveBeenCalledWith('/users/10');
  });
});
