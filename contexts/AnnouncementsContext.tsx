import React, { createContext, useContext, useReducer } from 'react';
import { Announcement } from '../models';

export enum AnnouncementActionType {
  ADD = 'ADD',
  REMOVE = 'REMOVE'
}

type AnnouncementAction =
  | { type: AnnouncementActionType.ADD; announcement: Announcement }
  | { type: AnnouncementActionType.REMOVE; id: string };

interface AnnouncementState {
  announcements: ReadonlyArray<Announcement>;
}

interface AnnouncementContextProps {
  state: AnnouncementState;
  dispatch: React.Dispatch<AnnouncementAction>;
}

const initialState: AnnouncementState = { announcements: [] };

const AnnouncementContext = createContext<AnnouncementContextProps>({
  state: initialState,
  dispatch: () => {}
});

function reducer(state: AnnouncementState, action: AnnouncementAction) {
  const { announcements } = state;
  switch (action.type) {
    case AnnouncementActionType.ADD: {
      // Check if an announcement with the same ID already exists
      const announcementExists = announcements.some(
        (announcement) => announcement.id === action.announcement.id
      );

      if (!announcementExists) {
        // If it doesn't exist, add it to the list
        return {
          ...state,
          announcements: [...announcements, action.announcement]
        };
      }

      // If it exists, return the current state without adding the new announcement
      return state;
    }
    case AnnouncementActionType.REMOVE: {
      return {
        ...state,
        announcements: announcements.filter((t) => t.id != action.id)
      };
    }
    default: {
      // console.warn('Invalid announcement context action: ', action);
      return state;
    }
  }
}

export function AnnouncementProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AnnouncementContext.Provider value={{ state, dispatch }}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncementContext() {
  return useContext(AnnouncementContext);
}
