import React, { Reducer, createContext, useContext, useReducer } from 'react';
import { Role, User } from '../models';
import { LatLng } from 'react-native-maps';

export enum UserActionType {
  UPDATE_USER = 'UPDATE_USER',
  UPDATE_MEMBER = 'UPDATE_MEMBER',
  UPDATE_LOCATION = 'UPDATE_LOCATION',
  LOGIN_USER = 'LOGIN_USER',
  LOGOUT_USER = 'LOGOUT_USER',
  UPDATE_HOUSEHOLD = 'UPDATE_HOUSEHOLD',
  REMOVE_HOUSEHOLD = 'REMOVE_HOUSEHOLD'
}

type UserAction =
  | { type: UserActionType.UPDATE_USER; user: User }
  | { type: UserActionType.UPDATE_MEMBER; member: User }
  | { type: UserActionType.UPDATE_LOCATION; location: LatLng }
  | { type: UserActionType.LOGIN_USER; user: User }
  | { type: UserActionType.LOGOUT_USER; user: null }
  | { type: UserActionType.UPDATE_HOUSEHOLD; householdId: string }
  | { type: UserActionType.REMOVE_HOUSEHOLD; householdId: undefined };

interface UserState {
  householdId: string | undefined;
  user: User | undefined;
  householdMembers: ReadonlyArray<User>;
}

interface UserContextProps {
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
}

const initialState: UserState = {
  householdId: undefined,
  user: undefined,
  householdMembers: []
};

const UserContext = createContext<UserContextProps>({
  state: initialState,
  dispatch: () => { }
});

const reducer: Reducer<UserState, UserAction> = (
  state: UserState,
  action: UserAction
): UserState => {
  const { user, householdMembers } = state;
  switch (action.type) {
    case UserActionType.UPDATE_USER: {
      console.log("context user update")
      return { ...state, user: { ...action.user } };
    }
    case UserActionType.UPDATE_MEMBER: {
      console.log("context user member")
      const others = householdMembers.filter((t) => t.id != action.member?.id);
      return { ...state, householdMembers: [...others, action.member] };
    }
    case UserActionType.UPDATE_LOCATION: {
      return {
        ...state,
        user: user
          ? {
            ...user,
            location: action.location
          }
          : undefined
      };
    }
    case UserActionType.LOGIN_USER: {
      console.log("context user login")
      return {
        ...state,
        user: action.user
      };
    }
    case UserActionType.LOGOUT_USER: {
      return {
        ...state,
        user: undefined
      };
    }
    case UserActionType.UPDATE_HOUSEHOLD: {
      console.log("context action household", action.householdId)
      return {
        ...state,
        householdId: action.householdId
      };
    }
    case UserActionType.REMOVE_HOUSEHOLD: {
      return {
        ...state,
        householdId: undefined
      };
    }
    default: {
      console.warn('Invalid user context action: ', action);
      return state;
    }
  }
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  console.log(" UserProvider ", state)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  return useContext(UserContext);
}
