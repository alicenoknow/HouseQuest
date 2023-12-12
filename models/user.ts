import { LatLng } from 'react-native-maps';

export enum Role {
  PARENT,
  CHILD
}

export interface User {
  name: string;
  role: Role;
  totalPoints: number;
  currentPoints: number;
  birthday?: Date;
  avatarUri?: string;
  location?: LatLng;
}
