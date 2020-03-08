import { Record as ImmutableRecord, Map } from 'immutable'

export type ImmutableGlobalState = Map<string, any>

export type ImmutableState<T> = ImmutableRecord<T> & Readonly<T>

export type ImmutableFieldSelectors<T extends Record<string, any>> = {
  [K in keyof T]: (state: ImmutableGlobalState) => ImmutableState<T>[K]
}

export type ImmutableSelfSelector<T extends Record<string, any>> = {
  self: (state: ImmutableGlobalState) => ImmutableState<T>
}

export type ImmutableSelectors<
  T extends Record<string, any>
> = ImmutableFieldSelectors<T> & ImmutableSelfSelector<T>

export interface ImmutableStateObject<T extends Record<string, any>> {
  create: () => ImmutableState<T>
  get: <K extends keyof T>(k: K) => (s: ImmutableGlobalState) => T[K]
  selectors: ImmutableSelectors<T>
  namespace: string
}

export const createState = <T extends Record<string, any>>(
  namespace: string,
  fields: T
): ImmutableStateObject<T> => {
  const create = () => {
    const StateShape = ImmutableRecord<T>(fields)
    return new StateShape()
  }

  const get = <K extends keyof T>(k: K) => (state: ImmutableGlobalState) => {
    const localState: ImmutableState<T> = state.get(namespace)
    return localState.get(k)
  }

  const selectors: ImmutableSelectors<T> = {} as ImmutableSelectors<T>

  for (const k in fields) {
    // @ts-ignore
    selectors[k] = get(k)
  }
  selectors['self'] = (state: ImmutableGlobalState) => state.get(namespace)

  return {
    create,
    get,
    namespace,
    selectors,
  }
}
