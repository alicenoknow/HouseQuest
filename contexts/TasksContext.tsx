import React, { createContext, useContext, useReducer } from 'react'
import { Task, TaskStatus } from "../models";

export enum TaskActionType {
    ADD = "ADD",
    REMOVE = "REMOVE",
    ASSIGN = "ASSIGN",
    UNASSIGN = "UNASSIGN",
    SUBMIT = "SUBMIT",
    CONFIRM = "CONFIRM",
    DECLINE = "DECLINE"
}

type TaskAction =
    | { type: TaskActionType.ADD, task: Task }
    | { type: TaskActionType.ASSIGN, id: string, user: string }
    | { type: TaskActionType.UNASSIGN, id: string }
    | { type: TaskActionType.SUBMIT, id: string, photoUri: string }
    | { type: TaskActionType.CONFIRM, id: string }
    | { type: TaskActionType.DECLINE, id: string }
    | { type: TaskActionType.REMOVE, id: string };

interface TaskState {
    tasks: ReadonlyArray<Task>;
}

interface TaskContextProps {
    state: TaskState;
    dispatch: React.Dispatch<TaskAction>;
}

const initialState: TaskState = { tasks: [] }

const TaskContext = createContext<TaskContextProps>({ state: initialState, dispatch: () => { } });

function reducer(state: TaskState, action: TaskAction) {
    const { tasks } = state;
    switch (action.type) {
        case TaskActionType.ADD: {
            return { ...state, tasks: [...tasks.filter(t => t.id != action.task.id), action.task] };
        }
        case TaskActionType.REMOVE: {
            return {
                ...state,
                tasks: tasks.filter(t => t.id != action.id)
            };
        }
        case TaskActionType.ASSIGN: {
            const { id, user } = action;
            const toChange = tasks.filter(t => t.id == id)?.at(0);
            if (toChange) {
                return { ...state, tasks: [...tasks, { ...toChange, assignee: user, status: TaskStatus.ASSIGNED }] };
            }
            return state;
        }
        case TaskActionType.UNASSIGN: {
            const toChange = tasks.filter(t => t.id == action.id)?.at(0);
            if (toChange) {
                return { ...state, tasks: [...tasks, { ...toChange, assignee: undefined, status: TaskStatus.UNASSIGNED }] };
            }
            return state;
        } case TaskActionType.SUBMIT: {
            const { id, photoUri } = action;
            const toChange = tasks.filter(t => t.id == id)?.at(0);
            if (toChange) {
                return { ...state, tasks: [...tasks, { ...toChange, photoUri: photoUri, status: TaskStatus.SUBMITTED }] };
            }
            return state;
        } case TaskActionType.CONFIRM: {
            const toChange = tasks.filter(t => t.id == action.id)?.at(0);
            if (toChange) {
                return { ...state, tasks: [...tasks, { ...toChange, status: TaskStatus.CONFIRMED }] };
            }
            return state;
        }
        case TaskActionType.DECLINE: {
            const toChange = tasks.filter(t => t.id == action.id)?.at(0);
            if (toChange) {
                return { ...state, tasks: [...tasks, { ...toChange, status: TaskStatus.ASSIGNED }] };
            }
            return state;
        }
        default: {
            console.warn("Invalid task context action: ", action);
            return state;
        }
    }
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    return <TaskContext.Provider value={{ state, dispatch }}>
        {children}
    </TaskContext.Provider>
}

export function useTaskContext() {
    return useContext(TaskContext);
}