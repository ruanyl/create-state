## Create Immutable State Easily ![travis-ci](https://travis-ci.org/ruanyl/create-state.svg?branch=master)

An utility to easily create immutable state for Redux

## Usage
#### Primitive types
1. Define the State
```typescript
import { createState, StateObject } from 'immutable-state-creator'

const State = createState({
  name: 'User',
  fields: {
    name: 'my name',
    age: 10
  }
})
```

2. Create initial state
```typescript
const initState = State.create()
```

3. Use `getter` to select value
```typescript
expect(State.age.getter(initState)).toBe(10)
expect(State.name.getter(initState)).toBe('my name')
```

4. Use `setter` to update a value
```typescript
const newState = State.age.setter(20)(initState)
expect(State.age.getter(newState)).toBe(20)
```

#### Immutable List
```typescript
const State = createState({
  name: 'State',
  fields: {
    pets: List(['dog', 'cat']),
  }
})
```

Update a List by using `push` `pop` `shift` `unshift`

```typescript
{
  // use push to update a list
  const initState = State.create()
  const newState = State.pets.push('rabbit')(initState)
  expect(State.pets.getter(newState).size).toBe(3)
  expect(State.pets.getter(newState).toJS()).toEqual(['dog', 'cat', 'rabbit'])
}
{
  // use unshift to update a list
  const initState = State.create()
  const newState = State.pets.unshift('rabbit')(initState)
  expect(State.pets.getter(newState).size).toBe(3)
  expect(State.pets.getter(newState).toJS()).toEqual(['rabbit', 'dog', 'cat'])
}
{
  // use pop to update a list
  const initState = State.create()
  const newState = State.pets.pop(initState)
  expect(State.pets.getter(newState).size).toBe(1)
  expect(State.pets.getter(newState).toJS()).toEqual(['dog'])
}
{
  // use shift to update a list
  const initState = State.create()
  const newState = State.pets.shift(initState)
  expect(State.pets.getter(newState).size).toBe(1)
  expect(State.pets.getter(newState).toJS()).toEqual(['cat'])
}
```

#### Immutable Map
```typescript
const State = createState({
  name: 'State',
  fields: {
    job: Map({ title: 'my job', description: 'this is my first job' }),
  }
})
```
Use `delete` and `set` to update a Map
```typescript
{
  const initState = State.create()
  const newState = State.job.delete('title')(initState)
  expect(State.job.getter(newState).size).toBe(1)
  expect(State.job.get('title')(newState)).toBeUndefined()
  expect(State.job.get('description')(newState)).toBe('this is my first job')
}
{
  const initState = State.create()
  const newState = State.job.set('salary', 100)(initState)
  expect(State.job.get('salary')(newState)).toBe(100)
}
```

#### Immutable Set
```typescript
const State = createState({
  name: 'State',
  fields: {
    languages: Set(['PHP', 'Java']),
  }
})
```

Use `delete` and `add` to update a Set
```typescript
{
  const initState = State.create()
  const newState = State.languages.delete('PHP')(initState)
  expect(State.languages.getter(newState).toJS()).toEqual(['Java'])
}
{
  const initState = State.create()
  const newState = State.languages.add('JavaScript')(initState)
  expect(State.languages.getter(newState).size).toBe(3)
  expect(State.languages.getter(newState).toJS()).toEqual(expect.arrayContaining(['PHP', 'Java', 'JavaScript']))
}
```
