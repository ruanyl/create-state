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
      name: 'State',
      fields: {
        name: 'my name',
        age: 10
      }
    })
  });

  it('should have initial state', () => {
    const initState = State.create()
    expect(initState.get('age')).toBe(10)
    expect(initState.get('name')).toBe('my name')
  })

  it('should set value', function() {
    const initState = State.create()
    const newState = State.age.setter(20)(initState)
    expect(newState.get('age')).toBe(20)
    expect(newState.get('name')).toBe(initState.get('name'))

    const anotherState = State.name.setter('another name')(newState)
    expect(anotherState.get('name')).toBe('another name')
    expect(anotherState.get('age')).toBe(newState.get('age'))
  });
})
