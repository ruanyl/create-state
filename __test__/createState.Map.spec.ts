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
        job: Map({ title: 'my job', description: 'this is my first job' }),
        name: 'my name',
      }
    })
  });

  it('should clear a Map', function() {
    const initState = State.create()
    const newState = State.job.clear(initState)
    expect(newState.get('job').size).toBe(0)
  });

  it('should remove a key from Map', function() {
    const initState = State.create()
    const newState = State.job.delete('title')(initState)
    expect(State.job.getter(newState).size).toBe(1)
    expect(State.job.get('title')(newState)).toBeUndefined()
    expect(State.job.get('description')(newState)).toBe('this is my first job')
  });

  it('should add key value to a Map', function() {
    const initState = State.create()
    const newState = State.job.set('salary', 100)(initState)
    expect(State.job.get('salary')(newState)).toBe(100)
  });

  it('should concat two map', () => {
    const initState = State.create()
    const newState = State.job.concat({salary: 200})(initState)
    expect(State.job.get('salary')(newState)).toBe(200)
  })
});
