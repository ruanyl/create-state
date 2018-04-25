import { List, Map } from 'immutable'
import { createState, StateObject } from '../src'

interface Fields {
  pets: List<string>;
  job: Map<string, string>;
  name: string;
}

describe('Immutable List', function() {
  let State: StateObject<Fields>

  beforeEach(function() {
    State = createState<Fields>({
      name: 'State',
      fields: {
        pets: List(['dog', 'cat']),
        job: Map({ title: 'my job' }),
        name: 'my name',
      }
    })
  });

  it('should create an List', function() {
    const initState = State.create()
    expect(initState.get('pets').size).toBe(2)
  });

  it('should clear a List', function() {
    const initState = State.create()
    const newState = State.pets.clear(initState)
    expect(newState.get('pets').size).toBe(0)
  });

  it('should throw error if call undefined function', function() {
    const initState = State.create()
    expect(() => State.name.clear(initState)).toThrow(Error)
  });

  it('should push value to List', function() {
    const initState = State.create()
    const newState = State.pets.push('rabbit')(initState)
    expect(newState.get('pets').size).toBe(3)
    expect(newState.get('pets').toJS()).toEqual(['dog', 'cat', 'rabbit'])
  });
});
