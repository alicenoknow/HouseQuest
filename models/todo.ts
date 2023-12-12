export enum TodoStatus {
  WAITING,
  DONE
}

export interface Todo {
  timestamp: Date;
  status: TodoStatus;
  description: string;
  category: string;
}
