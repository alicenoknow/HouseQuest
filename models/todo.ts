export enum TodoStatus {
  WAITING,
  DONE
}

export interface Todo {
  id: string;
  timestamp: Date;
  status: TodoStatus;
  description: string;
  category: string;
}
