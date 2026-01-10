export interface Task {
  id: number;
  title: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  assignee: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
}

export const MOCK_TASKS: Task[] = [
  { id: 1, title: 'Mise en place de la BDD', category: 'BACKEND', priority: 'HIGH', assignee: 'Mike', dueDate: '2026-06-30', status: 'TODO' }
];