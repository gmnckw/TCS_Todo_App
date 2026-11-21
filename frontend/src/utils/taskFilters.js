import { FILTER_ALL, OVERDUE_FILTER } from '../config/constants';

export const DEFAULT_TASK_FILTERS = Object.freeze({
  status: FILTER_ALL,
  priority: FILTER_ALL,
  isOverdue: OVERDUE_FILTER.ALL,
});

// Drops empty filter values so the query string only carries active filters.
export const toQueryFilters = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== FILTER_ALL));

export const hasActiveFilters = (filters) => Object.keys(toQueryFilters(filters)).length > 0;
