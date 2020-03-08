## Create Immutable State Easily ![travis-ci](https://travis-ci.org/ruanyl/create-state.svg?branch=master)

An utility to easily create immutable state for Redux

## Usage
#### With immutablejs
1. Define the State
```typescript
import { createState } from 'immutable-state-creator/immutable'

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
const globalState = Map({
  [State.namespace]: localState,
})
```

3. Use `selectors` to select value
```typescript
expect(State.selectors.age(globalState)).toBe(10)
expect(State.selectors.active(globalState)).toBe(true)
```

#### With plain object
1. Define the State
```typescript
import { createState } from 'immutable-state-creator'

const State = createState('User', {
  name: 'my name',
  age: 10,
  languages: ['English'],
  pets: ['cat'],
  active: true,
})
```

2. Create initial state
```typescript
const initState = State.create()
const globalState = {
  [State.namespace]: localState,
}
```

3. Use `selectors` to select value
```typescript
expect(State.selectors.age(globalState)).toBe(10)
expect(State.selectors.active(globalState)).toBe(true)
```
