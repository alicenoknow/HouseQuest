import React, { createContext, useContext, useReducer } from 'react'
import { Todo, TodoStatus } from "../models";

export enum TodoActionType {
    ADD = "ADD",
    REMOVE = "REMOVE",
    DONE = "DONE",
}

type TodoAction =
    | { type: TodoActionType.ADD, todo: Todo }
    | { type: TodoActionType.REMOVE, id: string }
    | { type: TodoActionType.DONE, id: string };

interface TodoState {
    todos: ReadonlyArray<Todo>;
}

interface TodoContextProps {
    state: TodoState;
    dispatch: React.Dispatch<TodoAction>;
}

const initialState: TodoState = { todos: [] }

const TodoContext = createContext<TodoContextProps>({ state: initialState, dispatch: () => { } });

function reducer(state: TodoState, action: TodoAction) {
    const { todos } = state;
    switch (action.type) {
        case TodoActionType.ADD: {
            const others = todos.filter(t => t.id != action.todo.id);
            return { ...state, todos: [...others, action.todo] };
        }
        case TodoActionType.REMOVE: {
            return {
                ...state,
                todos: todos.filter(t => t.id != action.id)
            };
        }
        case TodoActionType.DONE: {
            const toChange = todos.filter(t => t.id == action.id)?.at(0);
            const others = todos.filter(t => t.id != action.id);
            if (toChange) {
                return { ...state, todos: [...others, { ...toChange, status: TodoStatus.DONE }] };
            }
            return state;
        }
        default: {
            console.warn("Invalid todo context action: ", action);
            return state;
        }
    }
}

export function TodoProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <TodoContext.Provider value={{ state, dispatch }}>
        {children}
    </TodoContext.Provider>
}

export function useTodoContext() {
    return useContext(TodoContext);
}