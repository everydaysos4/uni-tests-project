import { render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GroupsPage } from '../../src/pages/groups/groups-page';
import { getGroupsData } from '../../src/pages/users/api/get-groups-data';
import { getUsersData } from '../../src/pages/users/api/get-users-data';
import { groups, users } from '../fixtures/users';

vi.mock('../../src/pages/users/api/get-groups-data', () => ({ getGroupsData: vi.fn() }));
vi.mock('../../src/pages/users/api/get-users-data', () => ({ getUsersData: vi.fn() }));

describe('GroupsPage', () => {
  beforeEach(() => {
    getGroupsData.mockReset();
    getUsersData.mockReset();
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
    getGroupsData.mockResolvedValue(groups);
    getUsersData.mockResolvedValue(usersWithSharedGroup);

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
    getGroupsData.mockResolvedValue(groups.slice(0, 1));
    getUsersData.mockResolvedValue([users[2]]);

    render(<GroupsPage />);

    const ungrouped = (await screen.findByRole('heading', { name: 'Без группы' })).closest(
      'article',
    );
    expect(
      within(ungrouped).getByText('В этой группе пока нет назначенных специалистов.'),
    ).toBeVisible();
  });

  it('показывает ошибку, если API не загрузил данные', async () => {
    getGroupsData.mockRejectedValue(new Error('network'));
    getUsersData.mockResolvedValue([]);

    render(<GroupsPage />);

    expect(
      await screen.findByText(
        'Не удалось загрузить данные по группам. Проверьте доступность API и обновите страницу.',
      ),
    ).toBeVisible();
  });
});
