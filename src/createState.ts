import { Record } from 'immutable'
import { compose } from 'ramda'

import { getField, setField } from './utils'

export interface StateConfig<T> {
  namespace: string;
  fields: T;
}

export interface GlobalState {
  [key: string]: any;
  __root: any;
}

export type LocalState<T> = Record<T> & Readonly<T>

export const createState = <T extends object, K extends keyof T>(config: StateConfig<T>) => {
  const g = (state: GlobalState | LocalState<T>) => {
    if (state.has('__root')) {
      return state.get(config.namespace)
    }
    return state
  }

  const create = () => {
    const StateShape = Record<T>(config.fields)
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
