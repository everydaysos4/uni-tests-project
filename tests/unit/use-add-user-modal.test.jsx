import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useAddUserModal } from '../../src/pages/users/hooks/useAddUserModal';

describe('useAddUserModal', () => {
  it('хранит данные формы и отправляет нормализованный payload', async () => {
    const onAddUser = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    const { result } = renderHook(() => useAddUserModal(onAddUser, onClose, true));

    expect(result.current.formData).toEqual({
      fullName: '',
      username: '',
      email: '',
      groupId: '',
      status: 'active',
    });

    act(() => {
      result.current.handleChange('  Иван Иванов  ', 'fullName');
      result.current.handleChange(' ivan ', 'username');
      result.current.handleChange(' ivan@example.com ', 'email');
      result.current.handleChange('2', 'groupId');
      result.current.handleChange('review', 'status');
    });

    const event = { preventDefault: vi.fn() };
    await act(() => result.current.handleSubmit(event));

    expect(event.preventDefault).toHaveBeenCalledOnce();
    expect(onAddUser).toHaveBeenCalledWith({
      fullName: 'Иван Иванов',
      username: 'ivan',
      email: 'ivan@example.com',
      groupId: 2,
      status: 'review',
    });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('оставляет форму открытой и показывает ошибку при неуспешной отправке', async () => {
    const onAddUser = vi.fn().mockRejectedValue(new Error('server error'));
    const onClose = vi.fn();
    const { result } = renderHook(() => useAddUserModal(onAddUser, onClose, false));

    await act(() => result.current.handleSubmit({ preventDefault: vi.fn() }));

    expect(onAddUser).toHaveBeenCalledWith({
      fullName: '',
      username: '',
      email: '',
      groupId: null,
      status: 'active',
    });
    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.submitError).toBe(
      'Не удалось добавить пользователя. Проверьте данные и повторите попытку.',
    );
  });
});
