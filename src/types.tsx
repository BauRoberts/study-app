// src/types.tsx

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  completed: boolean;
  taskType: string;
  blockTitle: string;
  blockId: string;
}

export interface StudyBlock {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  tasks: Task[];
}
