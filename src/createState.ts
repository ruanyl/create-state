import { Record as ImmutableRecord, Map } from 'immutable'

export interface StateConfig<T> {
  namespace: string
  fields: T
}

export type GlobalState = Map<string, any>

export type State<T> = ImmutableRecord<T> & Readonly<T>

export type Selectors<T extends Record<string, any>> = {
  [K in keyof T]: (state: GlobalState) => T[K]
}

export interface StateObject<T extends Record<string, any>> {
  create: () => State<T>
  get: <K extends keyof T>(k: K) => (s: GlobalState) => T[K]
  set: <K extends keyof T>(k: K, v: T[K]) => (s: State<T>) => State<T>
  toggle: <K extends keyof T>(k: K) => (s: State<T>) => State<T>
  selectors: Selectors<T>
  namespace: string
}

export const createState = <T extends Record<string, any>>(namespace: string, fields: T): StateObject<T> => {

  const create = () => {
    const StateShape = ImmutableRecord<T>(fields)
    return new StateShape()
  }

  const get = <K extends keyof T>(k: K) => (state: GlobalState) => {
    const localState: State<T>  = state.get(namespace)
    return localState.get(k)
  }

  const set = <K extends keyof T>(k: K, v: T[K]) => (state: State<T>) => {
    return state.set(k, v)
  }

  const toggle = <K extends keyof T>(k: K) => (state: State<T>) => {
    const current = state.get(k)
    if (typeof current === 'boolean') {
      return state.set(k, !current as any)
    }
    console.error(`Can not toggle the value of: ${namespace}.${k}, which has to be a boolean`)
    return state
  }

  const selectors: Selectors<T> = {} as Selectors<T>
  Object.keys(fields).forEach(k => {
    selectors[k] = get(k)
  })

  return {
    create,
    get,
    set,
    toggle,
    namespace,
    selectors,
  }
}
