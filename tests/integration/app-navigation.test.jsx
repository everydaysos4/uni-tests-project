import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../../src/app/app';
import { groups, users } from '../fixtures/users';

const apiMock = vi.hoisted(() => ({
  getUsers: vi.fn(),
  getGroups: vi.fn(),
  addUser: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock('../../src/pages/users/api/users-api', () => ({ usersApi: apiMock }));

describe('маршруты приложения', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    apiMock.getUsers.mockResolvedValue(users);
    apiMock.getGroups.mockResolvedValue(groups);
  });

  it('открывает Home и переходит на Users и Groups через навигацию', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /TEAM DIRECTORY/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'TEAM DIRECTORY' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    fireEvent.click(screen.getByRole('link', { name: 'Сотрудники платформы' }));
    expect(await screen.findByText('Борис Волков')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Сотрудники платформы' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    fireEvent.click(screen.getByRole('link', { name: 'Рабочие группы' }));
    expect(await screen.findByRole('heading', { name: 'Команды и участники' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Рабочие группы' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });
});
