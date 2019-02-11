import { createState } from '../src'

interface Fields {
  name: string;
  age: number;
}

const State = createState<Fields, keyof Fields>({
  namespace: 'User',
  fields: {
    name: 'my name',
    age: 10
  }
})

describe('String and Number', () => {
  it('should have initial state', () => {
    const initState = State.create()
    expect(State.get('age')(initState)).toBe(10)
    expect(State.get('name')(initState)).toBe('my name')
  })

  it('should set a value', function() {
    const initState = State.create()
    const newState = State.set('age', 20)(initState)
    expect(State.get('age')(newState)).toBe(20)
    expect(newState.get('name')).toBe(initState.get('name'))

    const anotherState = State.set('name', 'another name')(newState)
    expect(anotherState.get('name')).toBe('another name')
    expect(anotherState.get('age')).toBe(newState.get('age'))
  });
})
