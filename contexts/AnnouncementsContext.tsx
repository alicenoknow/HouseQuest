import React, { createContext, useContext, useReducer } from 'react'
import { Announcement } from "../models";

export enum AnnouncementActionType {
    ADD = "ADD",
    REMOVE = "REMOVE",
}

type AnnouncementAction =
    | { type: AnnouncementActionType.ADD, announcement: Announcement }
    | { type: AnnouncementActionType.REMOVE, id: string };

interface AnnouncementState {
    announcements: ReadonlyArray<Announcement>;
}

interface AnnouncementContextProps {
    state: AnnouncementState;
    dispatch: React.Dispatch<AnnouncementAction>;
}

const initialState: AnnouncementState = { announcements: [] }

const AnnouncementContext = createContext<AnnouncementContextProps | undefined>(undefined);

function reducer(state: AnnouncementState, action: AnnouncementAction) {
    const { announcements } = state;
    switch (action.type) {
        case AnnouncementActionType.ADD: {
            return { ...state, announcements: [...announcements, action.announcement] };
        }
        case AnnouncementActionType.REMOVE: {
            return {
                ...state,
                announcements: announcements.filter(t => t.id != action.id)
            };
        }
        default: {
            console.warn("Invalid announcement context action: ", action);
            return state;
        }
    }
}

export function AnnouncementProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <AnnouncementContext.Provider value={{ state, dispatch }}>
        {children}
    </AnnouncementContext.Provider>
}

export function useAnnouncementContext() {
    return useContext(AnnouncementContext);
}