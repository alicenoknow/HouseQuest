export enum Type {
  KUDOS,
  SLOBS
}

export interface KudosOrSlobs {
  id: string;
  type: Type;
  sender: string;
  receiver: string;
  message: string;
  timestamp: Date;
  points?: number;
}
