import { Record as ImmutableRecord } from 'immutable'
import { compose } from 'ramda'

export interface StateConfig<T> {
  namespace: string;
  fields: T;
}

export interface GlobalState {
  [key: string]: any;
  __root: any;
}

export type LocalState<T> = ImmutableRecord<T> & Readonly<T>

export const setField = <T extends Record<string, any>, K extends keyof T>(field: K, value: T[K]) =>
  (state: LocalState<T>) => state.set(field, value)

export const getField = <T extends Record<string, any>, K extends keyof T>(field: K) =>
  (state: LocalState<T>) => state.get(field)

export interface StateObject<T extends Record<string, any>, K extends keyof T> {
  create: () => LocalState<T>
  get: (k: K) => (s: LocalState<T>) => LocalState<T>
  set: (k: K, v: T[K]) => (s: LocalState<T>) => LocalState<T>
  namespace: string
}

export const createState = <T extends Record<string, any>, K extends keyof T>(config: StateConfig<T>): StateObject<T, K> => {
  const g = (state: GlobalState | LocalState<T>) => {
    if (state.has('__root')) {
      return state.get(config.namespace)
    }
    return state
  }

  const create = () => {
    const StateShape = ImmutableRecord<T>(config.fields)
    return new StateShape()
  }

  const get = (k: K) => {
    return compose(getField<T, K>(k), g)
  }

  const set = (k: K, v: T[K]) => {
    return compose(setField<T, K>(k, v), g)
  }

  return {
    create,
    get,
    set,
    namespace: config.namespace,
  }
}
