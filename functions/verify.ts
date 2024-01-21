import { User } from '../models';

export function verifyUser(user: User | undefined): user is User {
  return user != undefined;
}

export function verifyHousehold(
  householdId: string | undefined
): householdId is string {
  return householdId != undefined;
}
