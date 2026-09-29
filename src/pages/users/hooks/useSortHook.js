import { useMemo, useState } from 'react';
import { UserDirectory } from '../model/user-directory';

export const useSortHook = (items, query = '', initialField = 'fullName', initialOrder = 'asc') => {
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
    return new UserDirectory(items).find(query, sortField, sortOrder);
  }, [items, query, sortField, sortOrder]);

  return {
    sortedItems,
    sortField,
    sortOrder,
    handleSort,
  };
};
