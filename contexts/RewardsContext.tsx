import React, { createContext, useContext, useReducer } from 'react'
import { Reward, RewardStatus } from "../models";

export enum RewardsActionType {
    ADD = "ADD",
    REMOVE = "REMOVE",
    REQUEST = "REQUEST",
    ACCEPT = "ACCEPT",
    DECLINE_REQUEST = "DECLINE_REQUEST",
}

type RewardsAction =
    | { type: RewardsActionType.ADD, reward: Reward }
    | { type: RewardsActionType.REMOVE, id: string }
    | { type: RewardsActionType.REQUEST, id: string }
    | { type: RewardsActionType.ACCEPT, id: string }
    | { type: RewardsActionType.DECLINE_REQUEST, id: string };

interface RewardsState {
    rewards: ReadonlyArray<Reward>;
}

interface RewardsContextProps {
    state: RewardsState;
    dispatch: React.Dispatch<RewardsAction>;
}

const initialState: RewardsState = { rewards: [] }

const RewardsContext = createContext<RewardsContextProps>({ state: initialState, dispatch: () => { } });

function reducer(state: RewardsState, action: RewardsAction) {
    const { rewards } = state;
    switch (action.type) {
        case RewardsActionType.ADD: {
            return { ...state, rewards: [...rewards, action.reward] };
        }
        case RewardsActionType.REMOVE: {
            return {
                ...state,
                rewards: rewards.filter(t => t.id != action.id)
            };
        }
        case RewardsActionType.REQUEST: {
            const toChange = rewards.filter(t => t.id == action.id)?.at(0);
            if (toChange) {
                return { ...state, rewards: [...rewards, { ...toChange, status: RewardStatus.REQUESTED }] };
            }
            return state;
        }
        case RewardsActionType.ACCEPT: {
            const toChange = rewards.filter(t => t.id == action.id)?.at(0);
            if (toChange) {
                return { ...state, rewards: [...rewards, { ...toChange, status: RewardStatus.GRANTED }] };
            }
            return state;
        }
        case RewardsActionType.DECLINE_REQUEST: {
            const toChange = rewards.filter(t => t.id == action.id)?.at(0);
            if (toChange) {
                return { ...state, rewards: [...rewards, { ...toChange, status: RewardStatus.AVAILABLE }] };
            }
            return state;
        }
        default: {
            console.warn("Invalid rewards context action: ", action);
            return state;
        }
    }
}

export function RewardsProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <RewardsContext.Provider value={{ state, dispatch }}>
        {children}
    </RewardsContext.Provider>
}

export function useRewardsContext() {
    return useContext(RewardsContext);
};
