import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AddUserModal } from '../../src/pages/users/ui/add-user-modal/add-user-modal';
import { groups } from '../fixtures/users';

describe('AddUserModal', () => {
  it('закрывается кнопкой, кликом по overlay и клавишей Escape', async () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <AddUserModal isOpen onClose={onClose} groups={groups} onAddUser={vi.fn()} />,
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.click(screen.getByTestId('modal-overlay'));
    fireEvent.click(screen.getByRole('button', { name: 'Закрыть' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(3);

    rerender(<AddUserModal isOpen={false} onClose={onClose} groups={groups} onAddUser={vi.fn()} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(3);
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });

  it('отправляет null для пустой группы', async () => {
    const user = userEvent.setup();
    const onAddUser = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    render(<AddUserModal isOpen onClose={onClose} groups={groups} onAddUser={onAddUser} />);

    await user.type(screen.getByLabelText('Полное имя'), 'Иван Иванов');
    await user.type(screen.getByLabelText('Юзернейм'), 'ivan');
    await user.type(screen.getByLabelText('Email'), 'ivan@example.com');
    await user.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(onAddUser).toHaveBeenCalledWith({
      fullName: 'Иван Иванов',
      username: 'ivan',
      email: 'ivan@example.com',
      groupId: null,
      status: 'active',
    });
    expect(onClose).toHaveBeenCalledOnce();
  });
});
