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
  get: (k: K) => (s: LocalState<T>) => T[K]
  set: <V extends T[K]>(k: K, v: V) => (s: LocalState<T>) => LocalState<T>
  toggle: (k: K) => (s: LocalState<T>) => LocalState<T>
  namespace: string
}

export const createState = <T extends Record<string, any>, K extends keyof T>(namespace: string, fields: T): StateObject<T, K> => {
  const g = (state: GlobalState | LocalState<T>) => {
    if (state.has('__root')) {
      return state.get(namespace)
    }
    return state
  }

  const create = () => {
    const StateShape = ImmutableRecord<T>(fields)
    return new StateShape()
  }

  const get = (k: K) => {
    return compose(getField<T, K>(k), g)
  }

  const set = <V extends T[K]>(k: K, v: V) => {
    return compose(setField<T, K>(k, v), g)
  }

  const toggle = (k: K) => (s: LocalState<T>) => {
    const current = get(k)(s)
    if (typeof current === 'boolean') {
      return set(k, !current as any)(s)
    }
    console.error(`Can not toggle the value of: ${namespace}.${k}, which has to be a boolean`)
    return s
  }

  return {
    create,
    get,
    set,
    toggle,
    namespace,
  }
}
