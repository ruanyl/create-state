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
    State = createState({
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

  it('should throw error if call `push` on Map', function() {
    const initState = State.create()
    expect(() => State.job.push('')(initState)).toThrow(Error)
  });

  it('should push value to List', function() {
    const initState = State.create()
    const newState = State.pets.push('rabbit')(initState)
    expect(State.pets.getter(newState).size).toBe(3)
    expect(State.pets.getter(newState).toJS()).toEqual(['dog', 'cat', 'rabbit'])
  });

  it('should unshift value to List', function() {
    const initState = State.create()
    const newState = State.pets.unshift('rabbit')(initState)
    expect(State.pets.getter(newState).size).toBe(3)
    expect(State.pets.getter(newState).toJS()).toEqual(['rabbit', 'dog', 'cat'])
  });

  it('should pop value from a List', function() {
    const initState = State.create()
    const newState = State.pets.pop(initState)
    expect(State.pets.getter(newState).size).toBe(1)
    expect(State.pets.getter(newState).toJS()).toEqual(['dog'])
  });

  it('should shift value from a List', function() {
    const initState = State.create()
    const newState = State.pets.shift(initState)
    expect(State.pets.getter(newState).size).toBe(1)
    expect(State.pets.getter(newState).toJS()).toEqual(['cat'])
  });
});
