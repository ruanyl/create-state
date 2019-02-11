import { Record } from 'immutable'

export const setField = <T extends object, K extends keyof T>(field: K, value: T[K]) => (state: Record<T> & Readonly<T>) => state.set(field, value)
export const getField = <T extends object, K extends keyof T>(field: K) => (state: Record<T> & Readonly<T>) => state.get(field)
export const incField = (field: string) => (state: any) => state.set(field, state.get(field) + 1)
export const decField = (field: string) => (state: any) => state.set(field, state.get(field) - 1)
export const toggleField = (field: string) => (state: any) => state.set(field, !state.get(field))
