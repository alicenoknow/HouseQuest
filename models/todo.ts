export enum TodoStatus {
  WAITING,
  DONE
}

export enum TodoCategory {
  GENERAL = 'General',
  SHOPPING = 'Shopping',
  SCHOOL = 'School',
  PET = 'Pet',
  OTHER = 'Other'
}

export interface Todo {
  id: string;
  timestamp: Date;
  status: TodoStatus;
  description: string;
  category: TodoCategory;
}
