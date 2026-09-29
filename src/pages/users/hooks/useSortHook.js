import { useMemo, useState } from 'react';
import { sortUsers } from '../model/user-list';

export const useSortHook = (items, initialField = 'fullName', initialOrder = 'asc') => {
  const [sortField, setSortField] = useState(initialField);
  const [sortOrder, setSortOrder] = useState(initialOrder);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortField(field);
    setSortOrder('asc');
  };

  const sortedItems = useMemo(() => {
    return sortUsers(items, sortField, sortOrder);
  }, [items, sortField, sortOrder]);

  return {
    sortedItems,
    sortField,
    sortOrder,
    handleSort,
  };
};
