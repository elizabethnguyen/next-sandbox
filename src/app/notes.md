# General HTML Things
* use `<button>` instead of `<div>` because you want to make your DOM components clear for screen readers


# General Javascript Things
## Async / Await
```
async function myFunction() {
    return 5;
}

// option one
myFunction().then(data => console.log(data));

// option two
try {
    const val = await myFunction();
} catch (err) {
    console.log(err);
}
```

`await` will defer execution of the code until the promise resolves.
This is not blocking but it goes on the event loop callstack, so subsequent awaits will be blocked by previous ones.


# React Things
## Defining a component
```
interface Props {
    myProp: string;
}

export function MyComponent({ myProp }: Props) {
    return (<div>{myProp}</div>);
}
```

## A function
```
function MyFunction(msg: string): boolean => {
    console.log(msg);

    return msg == 'cat';
}
```

## An arrow function
```
const consoleLog = (msg: string) => {
    console.log(msg);
}
```

## Hooks
### useState
The only way to safely mutate state.
```
const [isValid, setIsValid] = useState<boolean>(true);
```

### useCallback
For functions.
An arrow function should useCallback to avoid redeclaring the function every time the component is re-rendered
```
const consoleLog = useCallback((msg: string) => {
    console.log(msg);
}, []);
[...]
return(
    <button onClick={consoleLog('test')}>Click me!</button>
)
```

### useEffect
For side effects (secondary behaviors).
Example: analytics tracking is a secondary behavior when a page loads, so we can use `useEffect` to update the state for analytics.

Other examples may include fetching data on load, onComponentMount, etc.


### useMemo
For values.
This is an optimization for performance, but can be tricky to do correctly (easy to overmemo and easy to have all your memos do nothing because of your render tree).
Memoing too much also loses readability - i.e. it can be hard to know what the intention was behind memoizing if the code isn't yours


### memo()
For components. Prevents rerendering a component when it's parent component rerenders.


# Typescript Things
## Why Typescript?
* Strongly-typed means failures at build time instead of runtime, you can catch issues in your IDE, everything is more readable and given explicit intention


## Why not Typescript?
* Type-checking will become slow in larger codebases, meaning that Intellisense may not load quickly or at all.
* Can give a false sense of security that everything is working as intended, because you can skirt the type rules easily/accidentally (i.e. casting, gratiuitous use of `any`)

The pros outweigh the cons though!


## use const
`const` does not make objects immutable, but `use const` does!
```
const DIRECTIONS = ['left', 'right', 'up', 'down'] as const;
```


## Interfaces
```
interface SampleInterface {
    name: string;
    age: number;
}
```


## Interfaces vs Type Aliases
Type aliases and interfaces are very similar, and in many cases you can choose between them freely. Almost all features of an interface are available in type, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.


## Inheritance
```
interface BaseEvent {
    title: string;
    description: string;
}

interface OneOffEvent extends BaseEvent {
    eventType: 'one_off';
    date: Date;
}

interface RecurringEvent extends BaseEvent {
    eventType: 'recurring';
    recurrence: number;
}
```

## Unions
When you're unsure of a type that you will be handling in a function (but they are subsets of some sort), allow both options and then use type discrimination to handle them each appropriately.
```
type CalendarEvent = OneOffEvent | RecurringEvent;
```


## Type Discrimination
```
function renderEvent(event: CalendarEvent) {
    if (event.eventType === 'one_off') {
        const date = event.date;
    } else {
        // well it has to be a RecurringEvent
        const recurrence = event.recurrence;
    }
}
```


## Intersections
Combine types to make a type that takes attributes from its parts.
```
type Animal = {
  name: string;
}

type Bear = Animal & { 
  honey: boolean;
}

const bear = getBear();
bear.name;
bear.honey;
```


## Other Interesting Ways to Type
```
type Colors = "red" | "green" | "blue";
type RGB = [red: number, green: number, blue: number];
const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    blue: [0, 0, 255]
} satisfies Record<Colors, string | RGB>;
```


## Any and Unknown
* Any lets Typescript go 'hands-off' and will not enact any type safeguards
* Unknown tells Typescript that we're unsure what value goes there but you can't perform any operations on this data unless you can introduce type guards / type predicates to demonstrate that this value is indeed of this type.



## Utility Types
Given a large interface:
```
interface Thing {
    a: number;
    b: string;
    c: boolean;
    d: Record<string, number>;
}
```


### Pick
You can select certain fields to be exposed to the function.
```
function workWithSubstOfThing(thing: Pick<Thing, 'a' | 'b'>) {
    const a = thing.a;
}
```


### Omit
You can select certain fields to be hidden from a function.
```
type SubsetOfThing = Omit<Thing, 'd' | 'b'>;
function workWithOmit(thing: SubsetOfThing) {
    const a = thing.a;
}
```


### Partial
A subset of a defined type. Commonly used to 'update' the superset type.

```
interface Todo {
    title: string;
    description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
    return {...todo, fieldsToUpdate};
}
```


### Other Notable Utility Types
* `Required` - opposite of `Partial`
* `ReadOnly` - immutable objects
* `Record<[type], [type]>`
* `NonNullable`

Remember that the `...` spread operator unwraps the objects and subsequent arguments following the first are upserts applied to the previous argument.

i.e. `...fieldsToUpdate` will be replacing and inserting any missing fields in `...todo` (there are of course no missing fields because this is a `Partial` of a Todo)

Also remember that `return {...todo, fieldsToUpdaate};` is returning a new copy of the updated data, otherwise you would be at risk of mutating an already existing object `todo` since Javascript is **pass-by-reference**.


### Satisfies
Confirms a type matches a specific interface without changing the type of the thing you're checking so that the thing you're checking can remain a stricter type than the

Even more strictly type something beyond a generic type; you can constrain your expected subset of values to explicit 'types'.

```
const exampleOne = "example" // the type is "example" and it's a subset of string
const exampleTwo: string = "example" // the type is explicitly string
const exampleThree = "example" satisfies string // the type is "example" but satisfies string
const exampleFour = "example" satisfies number // this does not work
const exampleFive = "exampl"

function testExample(example: "example"): boolean {
    return true;
}

This will work for exampleOne, exampleTwo, and exampleThree, and not exampleFour or exampleFive
```


## Enums
Are stupid and inherently risky and flawed.


## Advanced Types
### Type Predicates
User-defined type guard which lets you narrow typing in your code.

```
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();
 
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

`pet is Fish` which is in the form `parameterName is Type` is the type predicate.

## Never
`never` cannot be assigned to any type.
Use this in places where you want exhaustive checking (i.e. the default of a `switch` statement). When you add new types, if you forget to handle them, then you'll get an error from Typescript because you reached `never`.

```
interface Triangle {
  kind: "triangle";
  sideLength: number;
}
 
type Shape = Circle | Square | Triangle;
 
function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;
  }
}

Type 'Triangle' is not assignable to type 'never'.

```