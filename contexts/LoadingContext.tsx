import React, { createContext, useContext, useReducer } from 'react';
import { Todo, TodoStatus } from '../models';

export enum LoadingActionType {
  CHANGE_STATE = 'CHANGE_STATE'
}

type LoadingAction = {
  type: LoadingActionType.CHANGE_STATE;
  isLoading: boolean;
};

interface LoadingState {
  isLoading: boolean;
}

interface LoadingContextProps {
  state: LoadingState;
  dispatch: React.Dispatch<LoadingAction>;
}

const initialState: LoadingState = { isLoading: false };

const LoadingContext = createContext<LoadingContextProps>({
  state: initialState,
  dispatch: () => {}
});

function reducer(state: LoadingState, action: LoadingAction) {
  switch (action.type) {
    case LoadingActionType.CHANGE_STATE: {
      return { isLoading: action.isLoading };
    }
    default: {
      // console.warn("Invalid loading context action: ", action);
      return state;
    }
  }
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <LoadingContext.Provider value={{ state, dispatch }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  return useContext(LoadingContext);
}
