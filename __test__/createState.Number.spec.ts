import { List, Map, Set } from 'immutable'
import { createState, StateObject } from '../src'

interface Fields {
  pets: List<string>;
  job: Map<string, string>;
  name: string;
  languages: Set<string>;
  age: Number;
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
        age: 10,
      }
    })
  });

  it('should increase a number', function() {
    const initState = State.create()
    const newState = State.age.increase(initState)
    expect(State.age.getter(newState)).toBe(11)
  });

  it('should decrease a number', function() {
    const initState = State.create()
    const newState = State.age.decrease(initState)
    expect(State.age.getter(newState)).toBe(9)
  });
});
