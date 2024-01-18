export enum KSAction {
  KUDOS,
  SLOBS
}

export interface KudosOrSlobs {
  id: string;
  type: KSAction;
  sender: string;
  receiver: string;
  message: string;
  timestamp: Date;
  points?: number;
}
