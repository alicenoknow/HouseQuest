import React, { createContext, useReducer, useContext, Dispatch } from 'react';

interface LocationShareState {
    isEnabled: boolean;
}

type Action = { type: 'TOGGLE' };

interface LocationShareContextProps {
    state: LocationShareState;
    dispatch: Dispatch<Action>;
}

const initialState: LocationShareState = {
    isEnabled: false,
};

const LocationShareContext = createContext<LocationShareContextProps | undefined>(undefined);

function locationShareReducer(state: LocationShareState, action: Action): LocationShareState {
    switch (action.type) {
        case 'TOGGLE':
            return { ...state, isEnabled: !state.isEnabled };
        default:
            return state;
    }
}

export const LocationShareProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(locationShareReducer, initialState);

    return (
        <LocationShareContext.Provider value={{ state, dispatch }}>
            {children}
        </LocationShareContext.Provider>
    );
};

export const useLocationShare = () => {
    const context = useContext(LocationShareContext);
    if (context === undefined) {
        throw new Error('useLocationShare must be used within a LocationShareProvider');
    }
    return context;
};
