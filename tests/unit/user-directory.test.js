import { describe, expect, it, vi } from 'vitest';
import { UserDirectory, UserSorter } from '../../src/pages/users/model/user-directory';
import { users } from '../fixtures/users';

describe('UserDirectory', () => {
  it('ищет по имени и username без учёта регистра и пробелов', () => {
    const directory = new UserDirectory(users);

    expect(directory.find('  аННА ', 'fullName', 'asc')).toHaveLength(1);
    expect(directory.find('BORIS', 'fullName', 'asc')[0].id).toBe(1);
    expect(directory.find('нет-такого', 'fullName', 'asc')).toEqual([]);
  });

  it('передаёт отфильтрованный список внедрённому сортировщику', () => {
    const sorter = { sort: vi.fn(() => ['sorted']) };
    const directory = new UserDirectory(users, sorter);

    expect(directory.find('boris', 'email', 'desc')).toEqual(['sorted']);
    expect(sorter.sort).toHaveBeenCalledWith([users[0]], 'email', 'desc');
  });
});

describe('UserSorter', () => {
  const sorter = new UserSorter();

  it('сортирует строки asc/desc и не меняет исходный массив', () => {
    const source = [...users];

    expect(sorter.sort(source, 'username', 'asc').map(({ id }) => id)).toEqual([3, 1, 2]);
    expect(sorter.sort(source, 'username', 'desc').map(({ id }) => id)).toEqual([2, 1, 3]);
    expect(source).toEqual(users);
  });

  it('сортирует groupId asc/desc, включая null', () => {
    expect(sorter.sort(users, 'groupId', 'asc').map(({ id }) => id)).toEqual([2, 3, 1]);
    expect(sorter.sort(users, 'groupId', 'desc').map(({ id }) => id)).toEqual([1, 3, 2]);
  });

  it('сохраняет порядок равных значений', () => {
    const equalUsers = [
      { id: 1, fullName: 'Один', groupId: 4 },
      { id: 2, fullName: 'Один', groupId: 4 },
    ];

    expect(sorter.sort(equalUsers, 'fullName', 'asc').map(({ id }) => id)).toEqual([1, 2]);
    expect(sorter.sort(equalUsers, 'groupId', 'desc').map(({ id }) => id)).toEqual([1, 2]);
  });
});
