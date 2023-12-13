import React, { createContext, useContext, useReducer } from 'react'
import { KudosOrSlobs } from "../models";

export enum KudosOrSlobsActionType {
    ADD = "ADD",
    REMOVE = "REMOVE",
}

type KudosOrSlobsAction =
    | { type: KudosOrSlobsActionType.ADD, kudosOrSlobs: KudosOrSlobs }
    | { type: KudosOrSlobsActionType.REMOVE, id: string };

interface KudosOrSlobsState {
    kudosOrSlobs: ReadonlyArray<KudosOrSlobs>;
}

interface KudosOrSlobsContextProps {
    state: KudosOrSlobsState;
    dispatch: React.Dispatch<KudosOrSlobsAction>;
}

const initialState: KudosOrSlobsState = { kudosOrSlobs: [] }

const KudosOrSlobsContext = createContext<KudosOrSlobsContextProps | undefined>(undefined);

function reducer(state: KudosOrSlobsState, action: KudosOrSlobsAction) {
    const { kudosOrSlobs } = state;
    switch (action.type) {
        case KudosOrSlobsActionType.ADD: {
            return { ...state, kudosOrSlobs: [...kudosOrSlobs, action.kudosOrSlobs] };
        }
        case KudosOrSlobsActionType.REMOVE: {
            return {
                ...state,
                kudosOrSlobs: kudosOrSlobs.filter(t => t.id != action.id)
            };
        }
        default: {
            console.warn("Invalid kudosOrSlobs action: ", action);
            return state;
        }
    }
}

export function KudosOrSlobsProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <KudosOrSlobsContext.Provider value={{ state, dispatch }}>
        {children}
    </KudosOrSlobsContext.Provider>
}

export function useKudosOrSlobsContext() {
    return useContext(KudosOrSlobsContext);
};
