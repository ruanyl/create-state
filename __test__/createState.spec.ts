import { List } from 'immutable'
import { createState } from '../src'

interface Fields {
  name: string
  age: number
  active: boolean
  languages: string[]
  pets: List<string>
}

const State = createState<Fields, keyof Fields>('User', {
  name: 'my name',
  age: 10,
  languages: ['English'],
  pets: List.of('cat'),
  active: true,
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

    const anotherState = State.set<Fields['name']>('name', 'another name')(newState)
    expect(anotherState.get('name')).toBe('another name')
    expect(anotherState.get('age')).toBe(newState.get('age'))
  });

  it('should toggle a boolean value', () => {
    const initState = State.create()
    expect(initState.active).toBe(true)
    const newState = State.toggle('active')(initState)
    expect(newState.active).toBe(false)
  })
})
