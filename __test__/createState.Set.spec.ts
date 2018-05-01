import { List, Map, Set } from 'immutable'
import { createState, StateObject } from '../src'

interface Fields {
  pets: List<string>;
  job: Map<string, string>;
  name: string;
  languages: Set<string>;
}

describe('Immutable List', function() {
  let State: StateObject<Fields>

  beforeEach(function() {
    State = createState({
      name: 'State',
      fields: {
        pets: List(['dog', 'cat']),
        job: Map({ title: 'my job', description: 'this is my first job' }),
        name: 'my name',
        languages: Set(['PHP', 'Java']),
      }
    })
  });

  it('should clear a Set', function() {
    const initState = State.create()
    const newState = State.languages.clear(initState)
    expect(newState.get('languages').size).toBe(0)
  });

  it('should remove value from Set', function() {
    const initState = State.create()
    const newState = State.languages.delete('PHP')(initState)
    expect(State.languages.getter(newState).toJS()).toEqual(['Java'])
  });

  it('should add value to Set', function() {
    const initState = State.create()
    const newState = State.languages.add('JavaScript')(initState)
    expect(State.languages.getter(newState).size).toBe(3)
    expect(State.languages.getter(newState).toJS()).toEqual(expect.arrayContaining(['PHP', 'Java', 'JavaScript']))
  });
});
