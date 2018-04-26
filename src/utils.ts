import { flip, uncurryN, compose, curry } from 'ramda'

export const setField = (field: string) => (value: any) => (state: any) => state.set(field, value)
export const getField = (field: string) => (state: any) => state.get(field)
export const incField = (field: string) => (state: any) => state.set(field, state.get(field) + 1)
export const decField = (field: string) => (state: any) => state.set(field, state.get(field) - 1)
export const toggleField = (field: string) => (state: any) => state.set(field, !state.get(field))
export const flipCurry = compose(curry, flip, uncurryN(2))
