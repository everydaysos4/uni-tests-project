export class UserSorter {
  sort(users, field, order) {
    const direction = order === 'asc' ? 1 : -1;

    return [...users].sort((leftUser, rightUser) => {
      const leftValue = leftUser[field];
      const rightValue = rightUser[field];

      if (leftValue === rightValue) return 0;

      if (field === 'groupId') {
        return (leftValue > rightValue ? 1 : -1) * direction;
      }

      return leftValue.localeCompare(rightValue) * direction;
    });
  }
}

export class UserDirectory {
  constructor(users, sorter = new UserSorter()) {
    this.users = users;
    this.sorter = sorter;
  }

  find(query, sortField, sortOrder) {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredUsers = this.users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(normalizedQuery) ||
        user.username.toLowerCase().includes(normalizedQuery),
    );

    return this.sorter.sort(filteredUsers, sortField, sortOrder);
  }
}
