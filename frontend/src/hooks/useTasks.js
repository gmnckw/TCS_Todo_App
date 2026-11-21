import { useMemo } from 'react';
import * as taskService from '../services/taskService';
import { toQueryFilters } from '../utils/taskFilters';
import { useAsync } from './useAsync';

export function useTaskList(filters) {
  const query = useMemo(() => toQueryFilters(filters), [filters]);
  const queryKey = JSON.stringify(query);
  return useAsync(() => taskService.listTasks(query), [queryKey]);
}

// A null taskId (create mode) skips the request and resolves to no task.
export function useTask(taskId) {
  return useAsync(() => (taskId ? taskService.getTask(taskId) : Promise.resolve(null)), [taskId]);
}

// Thin, stable wrappers so pages never import services directly.
export function useTaskMutations() {
  return useMemo(
    () => ({
      createTask: taskService.createTask,
      updateTask: taskService.updateTask,
      deleteTask: taskService.deleteTask,
    }),
    [],
  );
}
