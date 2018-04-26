import { Record, Map } from 'immutable'
import { compose, mapObjIndexed } from 'ramda'

import { getField, setField } from './utils'

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
type EmptyImmutableSetter = (s: State) => State
type ImmutableSetter = (v: any) => (s: State) => State

interface ComputedProps<T> {
  getter: Getter<T>;
  setter: Setter<T>;
  clear: EmptyImmutableSetter;
  push: ImmutableSetter;
  unshift: ImmutableSetter;
  pop: EmptyImmutableSetter;
  shift: EmptyImmutableSetter;
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
    // const flippedSetter = flipCurry(setter)
    const clear = (s: State) => {
      const c = getter(s)
      return setter(c.clear())(s)
    }
    // TODO it should type safe
    const push = (v: any) => (s: State) => {
      // return compose(flippedSetter(s), c => c.push(v), getter)(s)
      const c = getter(s)
      return setter(c.push(v))(s)
    }
    const unshift = (v: any) => (s: State) => {
      const c = getter(s)
      return setter(c.unshift(v))(s)
    }
    const pop = (s: State) => {
      const c = getter(s)
      return setter(c.pop())(s)
    }
    const shift = (s: State) => {
      const c = getter(s)
      return setter(c.shift())(s)
    }
    const operations = { getter, setter, clear, push, unshift, pop, shift }

    return operations
  }

  const computedState = mapObjIndexed(assignProps, config.fields) as ComputedState<T>

  return Object.assign({}, emptyState, computedState)
}
