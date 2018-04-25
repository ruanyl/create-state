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

type State = any

type Getter<T> = (s: State) => T
type Setter<T> = (v: T) => (s: State) => State
type Clear = (s: State) => State

interface ComputedProps<T> {
  getter: Getter<T>;
  setter: Setter<T>;
  clear: Clear;
  push: (v: any) => (s: State) => State;
}

type ComputedState<T> = {
  [P in keyof T]: ComputedProps<T[P]>;
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
    const setter = (v: any) => compose(setField(prop)(v), g)
    const clear = (s: State) => {
      const c = getter(s)
      return setter(c.clear())(s)
    }
    const push = (v: any) => (s: State) => {
      const c = getter(s)
      return setter(c.push(v))(s)
    }
    const operations = { getter, setter, clear, push }

    const handler = {
      get: (o: any, p: string) => {
        if (!value[p] && p !== 'getter' && p !== 'setter') {
          throw new Error(`'${p}' is not defined on '${value.toString()}'`)
        } else {
          return o[p]
        }
      }
    }

    const proxy = new Proxy(operations, handler)
    return proxy
  }

  const computedState = mapObjIndexed(assignProps, config.fields) as ComputedState<T>

  return Object.assign({}, emptyState, computedState)
}
