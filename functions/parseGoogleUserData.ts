import { Role, User } from '../models';
import { firebaseUser } from '../models/firebaseUser';

export const parseGoogleUserData = (googleUserData: firebaseUser): User => {
  console.log('googleUserData', googleUserData.uid);
  return {
    id: googleUserData.uid,
    displayName: googleUserData.displayName,
    email: googleUserData.email,
    role: Role.PARENT, // Assuming a default role
    totalPoints: 0, // Default or calculated value
    currentPoints: 0, // Default or calculated value
    photoURL: googleUserData.photoURL,
    location: undefined // Default or actual value
  };
};
