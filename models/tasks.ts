export enum TaskStatus {
  UNASSIGNED,
  ASSIGNED,
  SUBMITTED,
  CONFIRMED
}

export interface Task {
  title: string;
  description: string;
  createdAt: Date;
  creator: string;
  assignee: string;
  status: TaskStatus;
  points?: number;
  submittedAt?: Date;
  submissionPhoto?: string;
}

export enum RewardStatus {
  AVAILABLE,
  REQUESTED,
  GRANTED
}

export interface Reward {
  title: string;
  description: string;
  createdAt: Date;
  creator: string;
  recipient: string;
  status: RewardStatus;
  points?: number;
}
