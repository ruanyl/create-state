## Create Immutable State Easily ![travis-ci](https://travis-ci.org/ruanyl/create-state.svg?branch=master)

An utility to easily create immutable state for Redux

## Usage
#### Primitive types
1. Define the State
```typescript
import { createState, StateObject } from 'immutable-state-creator'

const State = createState('User', {
  name: 'my name',
  age: 10,
  languages: ['English'],
  pets: List.of('cat'),
  active: true,
})
```

2. Create initial state
```typescript
const initState = State.create()
```

3. Use `getter` to select value
```typescript
expect(State.get('age')(initState)).toBe(10)
expect(State.get('name')(initState)).toBe('my name')
```

4. Use `setter` to update a value
```typescript
const newState = State.set('age', 20)(initState)
expect(State.get('age')(newState)).toBe(20)
```

#### Toggle boolean value
```typescript
const initState = State.create()
expect(initState.active).toBe(true)
const newState = State.toggle('active')(initState)
expect(newState.active).toBe(false)
```
