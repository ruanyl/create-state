import { createState } from '../src/plain'

const State = createState('User', {
  name: 'my name',
  age: 10,
  languages: ['English'],
  pets: ['cat'],
  active: true,
})

describe('String and Number', () => {
  it('should have initial state', () => {
    const localState = State.create()
    expect(localState.age).toBe(10)
    expect(localState.name).toBe('my name')
  })

  it('should create selectors', () => {
    const localState = State.create()
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
