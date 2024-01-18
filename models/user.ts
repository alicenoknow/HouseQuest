import { LatLng } from 'react-native-maps';

export enum Role {
  PARENT,
  CHILD
}

export interface User {
  id: string;
  displayName: string;
  email?: string;
  role: Role;
  totalPoints: number;
  currentPoints: number;
  birthday?: Date;
  photoUrl?: string;
  location?: LatLng;
}
