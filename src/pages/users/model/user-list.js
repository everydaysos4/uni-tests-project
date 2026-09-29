export const filterUsers = (users, query) => {
  const normalizedQuery = query.toLowerCase();

  return users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(normalizedQuery) ||
      user.username.toLowerCase().includes(normalizedQuery),
  );
};

export const sortUsers = (users, field, order) => {
  return [...users].sort((leftUser, rightUser) => {
    if (order === 'asc') {
      if (field === 'groupId') {
        if (leftUser[field] > rightUser[field]) return 1;
        if (leftUser[field] < rightUser[field]) return -1;
        return 0;
      }

      return leftUser[field].localeCompare(rightUser[field]);
    }

    if (field === 'groupId') {
      if (leftUser[field] < rightUser[field]) return 1;
      if (leftUser[field] > rightUser[field]) return -1;
      return 0;
    }

    return rightUser[field].localeCompare(leftUser[field]);
  });
};
