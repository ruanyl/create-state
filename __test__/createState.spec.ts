import { List } from 'immutable'
import { createState, StateObject } from '../src'

interface Fields {
  name: string;
  age: number;
}

describe('String and Number', () => {
  let State: StateObject<Fields>

  beforeEach(function() {
    State = createState<Fields>({
      name: 'User',
      fields: {
        name: 'my name',
        age: 10
      }
    })
  });

  it('should have initial state', () => {
    const initState = State.create()
    expect(State.age.getter(initState)).toBe(10)
    expect(State.name.getter(initState)).toBe('my name')
  })

  it('should set a value', function() {
    const initState = State.create()
    const newState = State.age.setter(20)(initState)
    expect(State.age.getter(newState)).toBe(20)
    expect(newState.get('name')).toBe(initState.get('name'))

    const anotherState = State.name.setter('another name')(newState)
    expect(anotherState.get('name')).toBe('another name')
    expect(anotherState.get('age')).toBe(newState.get('age'))
  });

  it('should throw error if call `clear` on String', function() {
    const initState = State.create()
    expect(() => State.name.clear(initState)).toThrow(Error)
  });

  it('should throw error if call `clear` on Number', function() {
    const initState = State.create()
    expect(() => State.age.clear(initState)).toThrow(Error)
  });
})
