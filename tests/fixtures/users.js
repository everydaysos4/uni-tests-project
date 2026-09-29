export const groups = [
  { id: 1, name: 'Мониторинг', description: 'Следит за событиями.' },
  { id: 2, name: 'Реагирование', description: 'Устраняет инциденты.' },
  { id: 3, name: 'Пустая группа', description: 'Пока без сотрудников.' },
];

export const users = [
  {
    id: 1,
    fullName: 'Борис Волков',
    username: 'boris.volkov',
    email: 'boris@example.com',
    groupId: 2,
    status: 'active',
  },
  {
    id: 2,
    fullName: 'Анна Петрова',
    username: 'zeta',
    email: 'zeta@example.com',
    groupId: null,
    status: 'offDuty',
  },
  {
    id: 3,
    fullName: 'Виктор Андреев',
    username: 'alpha',
    email: 'alpha@example.com',
    groupId: 1,
    status: 'review',
  },
];
