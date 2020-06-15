import { Record } from 'immutable'
import { createState } from '../src/'

const localState = {
  name: 'my name',
  age: 10,
  languages: ['English'],
  pets: ['cat'],
  active: true,
}

const State = createState('User', localState)

describe('String and Number', () => {
  it('should create selectors', () => {
    const globalState = {
      [State.namespace]: localState,
    }
    expect(State.selectors.active(globalState)).toBe(true)
    expect(State.selectors.age(globalState)).toBe(10)
    expect(State.selectors.languages(globalState)).toEqual(['English'])
    expect(State.selectors.pets(globalState)).toEqual(['cat'])
    expect(State.selectors.self(globalState)).toEqual(localState)
  })
})

const ImmutableShape = Record(localState)
const immutableLocalState = new ImmutableShape()

const ImmutableState = createState('User', immutableLocalState)

describe('String and Number', () => {
  it('should create selectors', () => {
    const globalState = {
      [State.namespace]: localState,
    }
    expect(ImmutableState.selectors.active(globalState)).toBe(true)
    expect(ImmutableState.selectors.age(globalState)).toBe(10)
    expect(ImmutableState.selectors.languages(globalState)).toEqual(['English'])
    expect(ImmutableState.selectors.pets(globalState)).toEqual(['cat'])
    expect(ImmutableState.selectors.self(globalState)).toEqual(localState)
  })
})
