export type AnyState = Record<string, any>

export type GlobalState = Record<string, State>

export type State<T = AnyState> = T & Readonly<T>

export type FieldSelectors<T extends Record<string, any>> = {
  [K in keyof T]: (state: GlobalState) => State<T>[K]
}

export type SelfSelector<T extends Record<string, any>> = {
  self: (state: GlobalState) => State<T>
}

export type Selectors<T extends Record<string, any>> = FieldSelectors<T> &
  SelfSelector<T>

export interface StateObject<T extends Record<string, any>> {
  create: () => State<T>
  get: <K extends keyof T>(k: K) => (s: GlobalState) => T[K]
  selectors: Selectors<T>
  namespace: string
}

export const createState = <T extends Record<string, any>>(
  namespace: string,
  fields: T
): StateObject<T> => {
  const create = () => {
    return Object.freeze(fields)
  }

  const get = <K extends keyof T>(k: K) => (state: GlobalState) => {
    const localState = state[namespace] as State<T>
    return localState[k]
  }

  const selectors = {} as Selectors<T>

  for (const k in fields) {
    // @ts-ignore
    selectors[k] = get(k)
  }
  selectors['self'] = (state: GlobalState) => state[namespace] as State<T>

  return {
    create,
    get,
    namespace,
    selectors,
  }
}
