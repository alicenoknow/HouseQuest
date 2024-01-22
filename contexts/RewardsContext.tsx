import React, { createContext, useContext, useReducer, useState } from 'react';
import { Modal, View, Text, Button, GestureResponderEvent, FlatList, TouchableOpacity } from 'react-native';
import { Reward, RewardStatus } from '../models';

export enum RewardsActionType {
    ADD = 'ADD',
    REMOVE = 'REMOVE',
    REQUEST = 'REQUEST',
    ACCEPT = 'ACCEPT',
    DECLINE_REQUEST = 'DECLINE_REQUEST',
}

interface RewardModalProps {
    isOpen: boolean;
    onClose: () => void;
    reward?: Reward | null;
}

type RewardsAction =
    | { type: RewardsActionType.ADD; reward: Reward }
    | { type: RewardsActionType.REMOVE; id: string }
    | { type: RewardsActionType.REQUEST; id: string }
    | { type: RewardsActionType.ACCEPT; id: string }
    | { type: RewardsActionType.DECLINE_REQUEST; id: string };

interface RewardsState {
    rewards: ReadonlyArray<Reward>;
}

interface RewardsContextProps {
    state: RewardsState;
    dispatch: React.Dispatch<RewardsAction>;
}

const initialState: RewardsState = { rewards: [] };

const RewardsContext = createContext<RewardsContextProps>({
    state: initialState,
    dispatch: () => { },
});

function reducer(state: RewardsState, action: RewardsAction) {
    const { rewards } = state;
    switch (action.type) {
        case RewardsActionType.ADD: {
            return { ...state, rewards: [...rewards, action.reward] };
        }
        case RewardsActionType.REMOVE: {
            return {
                ...state,
                rewards: rewards.filter((t) => t.id !== action.id),
            };
        }
        case RewardsActionType.REQUEST: {
            const toChange = rewards.find((t) => t.id === action.id);
            if (toChange) {
                return {
                    ...state,
                    rewards: [...rewards, { ...toChange, status: RewardStatus.REQUESTED }],
                };
            }
            return state;
        }
        case RewardsActionType.ACCEPT: {
            const toChange = rewards.find((t) => t.id === action.id);
            if (toChange) {
                return {
                    ...state,
                    rewards: [...rewards, { ...toChange, status: RewardStatus.GRANTED }],
                };
            }
            return state;
        }
        case RewardsActionType.DECLINE_REQUEST: {
            const toChange = rewards.find((t) => t.id === action.id);
            if (toChange) {
                return {
                    ...state,
                    rewards: [...rewards, { ...toChange, status: RewardStatus.AVAILABLE }],
                };
            }
            return state;
        }
        default: {
            console.warn('Invalid rewards context action: ', action);
            return state;
        }
    }
}

export function RewardProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <RewardsContext.Provider value={{ state, dispatch }}>
        {children}
    </RewardsContext.Provider>
}

export function useRewardContext() {
    return useContext(RewardsContext);
}

const RewardModal: React.FC<RewardModalProps> = ({ isOpen, onClose, reward }) => {
    function handleAddReward(event: GestureResponderEvent): void {
        throw new Error('Function not implemented.');
    }

    return (
        <Modal visible={isOpen} onRequestClose={onClose}>
            <View>
                {reward ? (
                    // Detalhes da recompensa
                    <View>
                        <Text>{reward.title}</Text>
                        <Text>{reward.description}</Text>
                        {/* Outros detalhes da recompensa */}
                    </View>
                ) : (
                    // Formulário para criar uma nova recompensa
                    <View>
                        <Text>Criar Nova Recompensa</Text>
                        {/* Adicione aqui os campos do formulário para criar uma nova recompensa */}
                        <Button title="Adicionar" onPress={handleAddReward} />
                        <Button title="Cancelar" onPress={onClose} />
                    </View>
                )}
            </View>
        </Modal>
    );
};

const RewardsPage = () => {
    const { state, dispatch } = useRewardsContext();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    function openRewardDetails(item: Reward): void {
        throw new Error('Function not implemented.');
    }

    return (
        <View>
            <Text>Lista de Recompensas</Text>
            <FlatList
                data={state.rewards}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => openRewardDetails(item)}>
                        <Text>{item.title}</Text>
                    </TouchableOpacity>
                )}
            />

            <Button title="Adicionar Nova Recompensa" onPress={openCreateModal} />

            {/* Modal para detalhes ou criação de recompensa */}
            <RewardModal isOpen={isCreateModalOpen} onClose={closeCreateModal} />
        </View>
    );
};

export function RewardsProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <RewardsContext.Provider value={{ state, dispatch }}>{children}</RewardsContext.Provider>;
}



export function useRewardsContext() {
    return useContext(RewardsContext);
}
