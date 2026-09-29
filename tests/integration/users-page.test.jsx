import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import toast from 'react-hot-toast';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsersPage } from '../../src/pages/users/users-page';
import { addUser } from '../../src/pages/users/api/add-user';
import { deleteUser } from '../../src/pages/users/api/delete-user';
import { getGroupsData } from '../../src/pages/users/api/get-groups-data';
import { getUsersData } from '../../src/pages/users/api/get-users-data';
import { groups, users } from '../fixtures/users';

vi.mock('../../src/pages/users/api/add-user', () => ({ addUser: vi.fn() }));
vi.mock('../../src/pages/users/api/delete-user', () => ({ deleteUser: vi.fn() }));
vi.mock('../../src/pages/users/api/get-groups-data', () => ({ getGroupsData: vi.fn() }));
vi.mock('../../src/pages/users/api/get-users-data', () => ({ getUsersData: vi.fn() }));

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderLoadedPage = async () => {
  getUsersData.mockResolvedValue(users);
  getGroupsData.mockResolvedValue(groups);

  render(<UsersPage />);
  expect(screen.getByText('Загружаем сотрудников...')).toBeVisible();
  await screen.findByRole('table');
};

const getVisibleNames = () =>
  within(screen.getByRole('table'))
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[0].textContent);

const openModal = () => {
  fireEvent.click(screen.getByRole('button', { name: '+' }));
  return screen.getByRole('dialog');
};

const fillRequiredFields = ({ fullName, username, email }) => {
  fireEvent.change(screen.getByLabelText('Полное имя'), { target: { value: fullName } });
  fireEvent.change(screen.getByLabelText('Юзернейм'), { target: { value: username } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: email } });
};

describe('UsersPage', () => {
  beforeEach(() => {
    [addUser, deleteUser, getGroupsData, getUsersData].forEach((mock) => mock.mockReset());
    toast.success.mockReset();
    toast.error.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('ищет по имени и username без учёта регистра и показывает отсутствие результатов', async () => {
    await renderLoadedPage();
    const search = screen.getByPlaceholderText('Искать по имени или юзернейму...');

    fireEvent.change(search, { target: { value: 'аННА' } });
    expect(getVisibleNames()).toEqual(['Анна Петрова']);

    fireEvent.change(search, { target: { value: 'BORIS.VOLKOV' } });
    expect(getVisibleNames()).toEqual(['Борис Волков']);

    fireEvent.change(search, { target: { value: 'нет-такого' } });
    expect(screen.getByText('По вашему запросу ничего не найдено')).toBeVisible();
    expect(getVisibleNames()).toEqual([]);
  });

  it('сортирует каждую колонку и переключает направление сортировки', async () => {
    await renderLoadedPage();

    expect(getVisibleNames()).toEqual(['Анна Петрова', 'Борис Волков', 'Виктор Андреев']);

    const fullNameHeader = screen.getByRole('columnheader', { name: /Full Name/ });
    fireEvent.click(fullNameHeader);
    expect(fullNameHeader).toHaveTextContent('↓');
    fireEvent.click(fullNameHeader);
    expect(fullNameHeader).toHaveTextContent('↑');

    const sortableColumns = ['Username', 'E-mail', 'Group', 'Status'];
    for (const column of sortableColumns) {
      const header = screen.getByRole('columnheader', { name: new RegExp(column) });
      fireEvent.click(header);
      expect(header).toHaveTextContent('↑');
      fireEvent.click(header);
      expect(header).toHaveTextContent('↓');
    }
  });

  it('добавляет пользователя с нормализованным payload и закрывает форму при успехе', async () => {
    await renderLoadedPage();
    const savedUser = {
      id: 10,
      fullName: 'Новый Сотрудник',
      username: 'new.user',
      email: 'new@example.com',
      groupId: 2,
      status: 'restricted',
    };
    addUser.mockResolvedValue(savedUser);

    openModal();
    fillRequiredFields({
      fullName: '  Новый Сотрудник  ',
      username: ' new.user ',
      email: ' new@example.com ',
    });
    fireEvent.change(screen.getByLabelText('Группа'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Статус'), { target: { value: 'restricted' } });
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(addUser).toHaveBeenCalledWith({
      fullName: 'Новый Сотрудник',
      username: 'new.user',
      email: 'new@example.com',
      groupId: 2,
      status: 'restricted',
    });
    expect(await screen.findByText('Новый Сотрудник')).toBeVisible();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith('Пользователь new.user добавлен');
  });

  it('при ошибке добавления сохраняет открытую форму, значения и список', async () => {
    await renderLoadedPage();
    addUser.mockRejectedValueOnce(new Error('server error'));

    openModal();
    fillRequiredFields({
      fullName: '  Ошибка Добавления  ',
      username: ' failed.user ',
      email: ' failed@example.com ',
    });
    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Не удалось добавить пользователя');
    expect(screen.getByRole('dialog')).toBeVisible();
    expect(screen.getByLabelText('Полное имя')).toHaveValue('  Ошибка Добавления  ');
    expect(getVisibleNames()).toHaveLength(users.length);
    expect(toast.error).toHaveBeenCalledWith('Не удалось добавить пользователя failed.user');
  });

  it('удаляет пользователя при успехе и сохраняет при ошибке API', async () => {
    await renderLoadedPage();
    deleteUser.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('server'));

    const borisRow = screen.getByText('Борис Волков').closest('tr');
    fireEvent.click(within(borisRow).getByRole('button'));
    await waitFor(() => {
      expect(screen.queryByText('Борис Волков')).not.toBeInTheDocument();
    });
    expect(toast.success).toHaveBeenCalledWith('Пользователь boris.volkov удалён');

    const annaRow = screen.getByText('Анна Петрова').closest('tr');
    fireEvent.click(within(annaRow).getByRole('button'));
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Не удалось удалить пользователя zeta');
    });
    expect(screen.getByText('Анна Петрова')).toBeVisible();
  });

  it('показывает ошибку загрузки вместо таблицы', async () => {
    getUsersData.mockRejectedValue(new Error('network'));
    getGroupsData.mockResolvedValue([]);

    render(<UsersPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Не удалось загрузить сотрудников. Повторите позже.',
    );
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
