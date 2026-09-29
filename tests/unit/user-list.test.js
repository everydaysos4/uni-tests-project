import { describe, expect, it } from 'vitest';
import { filterUsers, sortUsers } from '../../src/pages/users/model/user-list';
import { users } from '../fixtures/users';

describe('filterUsers', () => {
  it('ищет по имени и username без учёта регистра', () => {
    expect(filterUsers(users, 'аННА')).toEqual([users[1]]);
    expect(filterUsers(users, 'BORIS')).toEqual([users[0]]);
    expect(filterUsers(users, 'нет-такого')).toEqual([]);
  });
});

describe('sortUsers', () => {
  it('сортирует строки asc/desc и не меняет исходный массив', () => {
    const source = [...users];

    expect(sortUsers(source, 'username', 'asc').map(({ id }) => id)).toEqual([3, 1, 2]);
    expect(sortUsers(source, 'username', 'desc').map(({ id }) => id)).toEqual([2, 1, 3]);
    expect(source).toEqual(users);
  });

  it('сортирует groupId asc/desc, включая null', () => {
    expect(sortUsers(users, 'groupId', 'asc').map(({ id }) => id)).toEqual([2, 3, 1]);
    expect(sortUsers(users, 'groupId', 'desc').map(({ id }) => id)).toEqual([1, 3, 2]);
  });

  it('сохраняет порядок равных значений', () => {
    const equalUsers = [
      { id: 1, fullName: 'Один', groupId: 4 },
      { id: 2, fullName: 'Один', groupId: 4 },
    ];

    expect(sortUsers(equalUsers, 'fullName', 'asc').map(({ id }) => id)).toEqual([1, 2]);
    expect(sortUsers(equalUsers, 'groupId', 'asc').map(({ id }) => id)).toEqual([1, 2]);
    expect(sortUsers(equalUsers, 'groupId', 'desc').map(({ id }) => id)).toEqual([1, 2]);
  });
});
