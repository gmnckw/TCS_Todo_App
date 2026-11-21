import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as taskService from '../../services/taskService';
import { ApiError } from '../../services/apiError';
import { renderWithProviders } from '../../test/renderWithProviders';
import TasksPage from './TasksPage';

jest.mock('../../services/taskService');

const SAMPLE_TASKS = [
  {
    id: 10,
    title: 'Prepare sprint report',
    status: 'TODO',
    priority: 'HIGH',
    dueDate: '2026-12-01T17:00:00Z',
    assigneeId: 1,
    isOverdue: false,
  },
  {
    id: 11,
    title: 'Renew licence',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    dueDate: '2026-10-01T17:00:00Z',
    assigneeId: 1,
    isOverdue: true,
  },
];

describe('TasksPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows a loading state while tasks are fetched', () => {
    taskService.listTasks.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<TasksPage />);
    expect(screen.getByRole('status')).toHaveTextContent('Loading tasks');
  });

  it('shows an empty state with a create link when there are no tasks', async () => {
    taskService.listTasks.mockResolvedValue([]);
    renderWithProviders(<TasksPage />);

    expect(await screen.findByText('No tasks yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Create a task' })).toHaveAttribute('href', '/tasks/new');
  });

  it('shows an error state and retries on demand', async () => {
    taskService.listTasks
      .mockRejectedValueOnce(new ApiError({ status: 500, message: 'Server exploded' }))
      .mockResolvedValueOnce(SAMPLE_TASKS);
    renderWithProviders(<TasksPage />);

    expect(await screen.findByRole('alert')).toHaveTextContent('Server exploded');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Prepare sprint report')).toBeInTheDocument();
  });

  it('renders tasks with overdue flags', async () => {
    taskService.listTasks.mockResolvedValue(SAMPLE_TASKS);
    renderWithProviders(<TasksPage />);

    const table = await screen.findByRole('table');
    expect(within(table).getByRole('link', { name: 'Renew licence' })).toBeInTheDocument();
    expect(within(table).getByText('Overdue')).toBeInTheDocument();
  });

  it('refetches with only the active filters when a filter changes', async () => {
    taskService.listTasks.mockResolvedValue(SAMPLE_TASKS);
    renderWithProviders(<TasksPage />);
    await screen.findByRole('table');

    await userEvent.selectOptions(screen.getByLabelText('Priority'), 'HIGH');

    await waitFor(() =>
      expect(taskService.listTasks).toHaveBeenLastCalledWith({ priority: 'HIGH' }),
    );
  });

  it('shows a filtered empty state when no tasks match', async () => {
    taskService.listTasks.mockResolvedValueOnce(SAMPLE_TASKS).mockResolvedValueOnce([]);
    renderWithProviders(<TasksPage />);
    await screen.findByRole('table');

    await userEvent.selectOptions(screen.getByLabelText('Overdue'), 'true');

    expect(await screen.findByText('No tasks match these filters')).toBeInTheDocument();
  });
});
