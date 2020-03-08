import { List, Map } from 'immutable'

import { createState } from '../src/immutable'

const State = createState('User', {
  name: 'my name',
  age: 10,
  languages: ['English'],
  pets: List.of('cat'),
  active: true,
})

describe('String and Number', () => {
  it('should have initial state', () => {
    const localState = State.create()
    expect(localState.get('age')).toBe(10)
    expect(localState.get('name')).toBe('my name')
  })

  it('should create selectors', () => {
    const localState = State.create()
    const globalState = Map({
      [State.namespace]: localState,
    })
    expect(State.selectors.active(globalState)).toBe(true)
    expect(State.selectors.age(globalState)).toBe(10)
    expect(State.selectors.languages(globalState)).toEqual(['English'])
    expect(State.selectors.pets(globalState)).toEqual(List.of('cat'))
    expect(State.selectors.self(globalState)).toEqual(localState)
  })
})
