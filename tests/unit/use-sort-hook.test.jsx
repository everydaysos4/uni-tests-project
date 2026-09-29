import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useSortHook } from '../../src/pages/users/hooks/useSortHook';
import { users } from '../fixtures/users';

describe('useSortHook', () => {
  it('переключает порядок текущего поля и сбрасывает asc для нового', () => {
    const { result } = renderHook(() => useSortHook(users));

    expect(result.current.sortField).toBe('fullName');
    expect(result.current.sortOrder).toBe('asc');

    act(() => result.current.handleSort('fullName'));
    expect(result.current.sortOrder).toBe('desc');

    act(() => result.current.handleSort('username'));
    expect(result.current.sortField).toBe('username');
    expect(result.current.sortOrder).toBe('asc');
  });

  it('принимает начальные поле и порядок', () => {
    const { result } = renderHook(() => useSortHook([users[2]], 'username', 'desc'));

    expect(result.current.sortedItems.map(({ id }) => id)).toEqual([3]);
    expect(result.current.sortField).toBe('username');
    expect(result.current.sortOrder).toBe('desc');
  });
});
