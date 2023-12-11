export enum Type {
  KUDOS,
  SLOBS
}

export interface KudosOrSlobs {
  type: Type;
  sender: string;
  receiver: string;
  message: string;
  timestamp: Date;
  points?: number;
}
