import { Record, Map } from 'immutable'
import { compose, mapObjIndexed } from 'ramda'

import { getField, setField } from './utils'

export interface Dictionary {
  [key: string]: any
}

export interface StateConfig<T> {
  name: string;
  fields: T;
}

export type State = any

export type Getter<T> = (s: State) => T
export type Setter<T> = (v: T) => (s: State) => State
export type EmptyImmutableSetter = (s: State) => State
export type ImmutableSetter = (v: any) => (s: State) => State
export type ImmutableMapGetter = <K = any>(k: K) => (s: State) => K
export type ImmutableMapSetter = <K = any, V = any>(k: K, v: V) => (s: State) => Map<K, V>

export interface ComputedProps<T> {
  getter: Getter<T>;
  setter: Setter<T>;
  clear: EmptyImmutableSetter;
  push: ImmutableSetter;
  unshift: ImmutableSetter;
  pop: EmptyImmutableSetter;
  shift: EmptyImmutableSetter;
  delete: ImmutableSetter;
  get: ImmutableMapGetter;
  set: ImmutableMapSetter;
  add: ImmutableSetter;
}

export type ComputedState<T> = {
  [P in keyof T]: ComputedProps<T[P]>;
}

export interface EmptyState<T> {
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
    const remove = (key: any) => (s: State) => {
      const c = getter(s)
      return setter(c.delete(key))(s)
    }
    const get = (key: any) => compose(c => c.get(key), getter)
    const set = (key: any, value: any) => (s: State) => {
      const c = getter(s)
      return setter(c.set(key, value))(s)
    }
    const add = (v: any) => (s: State) => {
      const c = getter(s)
      return setter(c.add(v))(s)
    }
    const operations = { getter, setter, clear, push, unshift, pop, shift, delete: remove, get, set, add }

    return operations
  }

  const computedState = mapObjIndexed(assignProps, config.fields) as ComputedState<T>

  return Object.assign({}, emptyState, computedState)
}
