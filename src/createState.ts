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

export interface StateObject<T extends Record<string, any>> {
  create: () => LocalState<T>
  get: <K extends keyof T>(k: K) => (s: LocalState<T>) => T[K]
  set: <K extends keyof T>(k: K, v: T[K]) => (s: LocalState<T>) => LocalState<T>
  toggle: <K extends keyof T>(k: K) => (s: LocalState<T>) => LocalState<T>
  namespace: string
}

export const createState = <T extends Record<string, any>>(namespace: string, fields: T) => {
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

  const getField = <K extends keyof T>(field: K) => (state: LocalState<T>) => state.get(field)

  const setField = <K extends keyof T>(field: K, value: T[K]) =>
    (state: LocalState<T>) => state.set(field, value)

  const get = <K extends keyof T>(k: K) => {
    return compose(getField(k), g)
  }

  const set = <K extends keyof T>(k: K, v: T[K]) => {
    return compose(setField(k, v), g)
  }

  const toggle = <K extends keyof T>(k: K) => (s: LocalState<T>) => {
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
