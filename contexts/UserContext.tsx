import React, { createContext, useContext, useReducer } from 'react';
import { Role, User } from '../models';
import { LatLng } from 'react-native-maps';

export const mockUser = {
  id: '123',
  name: 'Alice',
  role: Role.PARENT,
  totalPoints: 420,
  currentPoints: 42,
  birthday: new Date('2000-02-01'),
  avatarUri:
    'https://user-images.githubusercontent.com/63087888/87461299-8582b900-c60e-11ea-82ff-7a27a51859d0.png',
  location: {
    latitude: 50.093105,
    longitude: 18.990783
  }
};

export enum UserActionType {
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_MEMBER = 'UPDATE_MEMBER',
  UPDATE_LOCATION = 'UPDATE_LOCATION',
  LOGIN_USER = 'LOGIN_USER',
  LOGOUT_USER = 'LOGOUT_USER'
}

type UserAction =
  | { type: UserActionType.UPDATE_USER; user: User }
  | { type: UserActionType.UPDATE_MEMBER; member: User }
  | { type: UserActionType.UPDATE_LOCATION; location: LatLng }
  | { type: UserActionType.LOGIN_USER; user: User }
  | { type: UserActionType.LOGOUT_USER; user: null };

interface UserState {
  user: User | null;
  householdMembers: ReadonlyArray<User>;
}

interface UserContextProps {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}

const initialState: UserState = { user: null, householdMembers: [] };

const UserContext = createContext<UserContextProps>({
  state: initialState,
  dispatch: () => {}
});

function reducer(state: UserState, action: UserAction) {
  const { user, householdMembers } = state;
  switch (action.type) {
    case UserActionType.UPDATE_USER: {
      return { ...state, user: { ...action.user } };
    }
    case UserActionType.UPDATE_MEMBER: {
      const others = householdMembers.filter((t) => t.id != action.member?.id);
      return { ...state, householdMembers: [...others, action.member] };
    }
    case UserActionType.UPDATE_LOCATION: {
      if (!user) return state;
      return {
        ...state,
        user: {
          ...user,
          location: action.location
        }
      };
    }
    case UserActionType.LOGIN_USER: {
      return { ...state, user: action.user };
    }

    case UserActionType.LOGOUT_USER: {
      return { ...state, user: null };
    }
    default: {
      console.warn('Invalid user context action: ', action);
      return state;
    }
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer<React.Reducer<UserState, UserAction>>(
    reducer,
    initialState
  );

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
