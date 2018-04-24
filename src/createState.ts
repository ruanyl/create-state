import { Record, Iterable, Set, List, Map } from 'immutable'
import { compose, type, mapObjIndexed } from 'ramda'

import { getField, setField, toggleField, incField, decField } from './utils'

interface Dictionary {
  [key: string]: any
}

interface StateConfig<T> {
  name: string;
  fields: T;
}

type State = Map<string, any>

type Getter<T> = (s: State) => T

type Setter<T> = (v: T) => (s: State) => State

interface GetterSetter<T> {
  getter: Getter<T>;
  setter: Setter<T>;
}

type ComputedState<T> = {
  [P in keyof T]: GetterSetter<T[P]>;
}

interface EmptyState<T> {
  create: () => Map<string, any>;
  name: string;
}

export type StateObject<T> = EmptyState<T> & ComputedState<T>

export const createState = <T extends Dictionary>(config: StateConfig<T>): StateObject<T> => {
  const g = (state: any) => {
    if (state.has('__root')) {
      return getField(config.name)(state)
    }
    return state
  }

  const emptyState = {
    create(): Map<string, any> {
      const StateShape = Record(config.fields)
      return new StateShape()
    },

    get name(): string {
      return config.name
    },
  }

  const assignProps = (value: any, prop: string) => {
    const getter = compose(getField(prop), g)
    const setter = (value: any) => compose(setField(prop)(value), g)
    return { getter, setter }
  }

  const computedState = mapObjIndexed(assignProps, config.fields) as ComputedState<T>

  return Object.assign({}, emptyState, computedState)
}
