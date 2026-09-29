import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GroupsPage } from '../../src/pages/groups/groups-page';
import { usersApi } from '../../src/pages/users/api/users-api';
import { groups, users } from '../fixtures/users';

vi.mock('../../src/pages/users/api/users-api', () => ({
  usersApi: {
    getGroups: vi.fn(),
    getUsers: vi.fn(),
  },
}));

describe('GroupsPage', () => {
  beforeEach(() => {
    usersApi.getGroups.mockReset();
    usersApi.getUsers.mockReset();
  });

  it('показывает загрузку, группы, счётчики, пустую группу и сотрудников без группы', async () => {
    const usersWithSharedGroup = [
      ...users,
      {
        id: 4,
        fullName: 'Алексей Белов',
        username: 'alex',
        email: 'alex@example.com',
        groupId: 1,
        status: 'onDuty',
      },
    ];
    usersApi.getGroups.mockResolvedValue(groups);
    usersApi.getUsers.mockResolvedValue(usersWithSharedGroup);

    render(<GroupsPage />);

    expect(screen.getByText('Загружаем состав рабочих групп...')).toBeVisible();

    const monitoringCard = await screen.findByRole('heading', { name: 'Мониторинг' });
    const monitoringArticle = monitoringCard.closest('article');
    expect(within(monitoringArticle).getByText('2')).toBeVisible();
    expect(
      within(monitoringArticle)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual([
      expect.stringContaining('Алексей Белов'),
      expect.stringContaining('Виктор Андреев'),
    ]);
    expect(within(monitoringArticle).getByText('На дежурстве')).toBeVisible();

    const emptyGroup = screen.getByRole('heading', { name: 'Пустая группа' }).closest('article');
    expect(within(emptyGroup).getByText('0')).toBeVisible();
    expect(
      within(emptyGroup).getByText('В этой группе пока нет назначенных специалистов.'),
    ).toBeVisible();

    const ungrouped = screen.getByRole('heading', { name: 'Без группы' }).closest('article');
    expect(within(ungrouped).getByText('1')).toBeVisible();
    expect(within(ungrouped).getByText('Анна Петрова')).toBeVisible();
  });

  it('показывает пустой блок «Без группы», когда все сотрудники назначены', async () => {
    usersApi.getGroups.mockResolvedValue(groups.slice(0, 1));
    usersApi.getUsers.mockResolvedValue([users[2]]);

    render(<GroupsPage />);

    const ungrouped = (await screen.findByRole('heading', { name: 'Без группы' })).closest(
      'article',
    );
    expect(
      within(ungrouped).getByText('В этой группе пока нет назначенных специалистов.'),
    ).toBeVisible();
  });

  it('показывает ошибку, если API не загрузил данные', async () => {
    usersApi.getGroups.mockRejectedValue(new Error('network'));
    usersApi.getUsers.mockResolvedValue([]);

    render(<GroupsPage />);

    expect(
      await screen.findByText(
        'Не удалось загрузить данные по группам. Проверьте доступность API и обновите страницу.',
      ),
    ).toBeVisible();
  });
});
