import { List, Map } from 'immutable'
import { createState } from '../src'

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

  it('should set a value', function() {
    const localState = State.create()

    const newState = State.set('age', 20)(localState)
    expect(newState.get('age')).toBe(20)
    expect(newState.get('name')).toBe(localState.get('name'))

    const anotherState = State.set('name', 'another name')(newState)
    expect(anotherState.get('name')).toBe('another name')
    expect(anotherState.get('age')).toBe(newState.get('age'))
  });

  it('should toggle a boolean value', () => {
    const initState = State.create()
    expect(initState.active).toBe(true)
    const newState = State.toggle('active')(initState)
    expect(newState.active).toBe(false)
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
  })
})
