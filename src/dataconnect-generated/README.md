# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetWorkout*](#getworkout)
  - [*ListExercises*](#listexercises)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*CreateWorkout*](#createworkout)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetWorkout
You can execute the `GetWorkout` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getWorkout(vars: GetWorkoutVariables): QueryPromise<GetWorkoutData, GetWorkoutVariables>;

interface GetWorkoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkoutVariables): QueryRef<GetWorkoutData, GetWorkoutVariables>;
}
export const getWorkoutRef: GetWorkoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getWorkout(dc: DataConnect, vars: GetWorkoutVariables): QueryPromise<GetWorkoutData, GetWorkoutVariables>;

interface GetWorkoutRef {
  ...
  (dc: DataConnect, vars: GetWorkoutVariables): QueryRef<GetWorkoutData, GetWorkoutVariables>;
}
export const getWorkoutRef: GetWorkoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getWorkoutRef:
```typescript
const name = getWorkoutRef.operationName;
console.log(name);
```

### Variables
The `GetWorkout` query requires an argument of type `GetWorkoutVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetWorkoutVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetWorkout` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetWorkoutData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetWorkoutData {
  workout?: {
    id: UUIDString;
    workoutDate: DateString;
    durationMinutes?: number | null;
    notes?: string | null;
    workoutExercises_on_workout: ({
      id: UUIDString;
      exercise: {
        name: string;
        muscleGroup?: string | null;
        equipment?: string | null;
      };
        sets_on_workoutExercise: ({
          id: UUIDString;
          reps: number;
          weight: number;
          rpe?: number | null;
          setNumber: number;
        } & Set_Key)[];
    } & WorkoutExercise_Key)[];
  } & Workout_Key;
}
```
### Using `GetWorkout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getWorkout, GetWorkoutVariables } from '@dataconnect/generated';

// The `GetWorkout` query requires an argument of type `GetWorkoutVariables`:
const getWorkoutVars: GetWorkoutVariables = {
  id: ..., 
};

// Call the `getWorkout()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getWorkout(getWorkoutVars);
// Variables can be defined inline as well.
const { data } = await getWorkout({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getWorkout(dataConnect, getWorkoutVars);

console.log(data.workout);

// Or, you can use the `Promise` API.
getWorkout(getWorkoutVars).then((response) => {
  const data = response.data;
  console.log(data.workout);
});
```

### Using `GetWorkout`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getWorkoutRef, GetWorkoutVariables } from '@dataconnect/generated';

// The `GetWorkout` query requires an argument of type `GetWorkoutVariables`:
const getWorkoutVars: GetWorkoutVariables = {
  id: ..., 
};

// Call the `getWorkoutRef()` function to get a reference to the query.
const ref = getWorkoutRef(getWorkoutVars);
// Variables can be defined inline as well.
const ref = getWorkoutRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getWorkoutRef(dataConnect, getWorkoutVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.workout);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.workout);
});
```

## ListExercises
You can execute the `ListExercises` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listExercises(): QueryPromise<ListExercisesData, undefined>;

interface ListExercisesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListExercisesData, undefined>;
}
export const listExercisesRef: ListExercisesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listExercises(dc: DataConnect): QueryPromise<ListExercisesData, undefined>;

interface ListExercisesRef {
  ...
  (dc: DataConnect): QueryRef<ListExercisesData, undefined>;
}
export const listExercisesRef: ListExercisesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listExercisesRef:
```typescript
const name = listExercisesRef.operationName;
console.log(name);
```

### Variables
The `ListExercises` query has no variables.
### Return Type
Recall that executing the `ListExercises` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListExercisesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListExercisesData {
  exercises: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    muscleGroup?: string | null;
    equipment?: string | null;
  } & Exercise_Key)[];
}
```
### Using `ListExercises`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listExercises } from '@dataconnect/generated';


// Call the `listExercises()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listExercises();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listExercises(dataConnect);

console.log(data.exercises);

// Or, you can use the `Promise` API.
listExercises().then((response) => {
  const data = response.data;
  console.log(data.exercises);
});
```

### Using `ListExercises`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listExercisesRef } from '@dataconnect/generated';


// Call the `listExercisesRef()` function to get a reference to the query.
const ref = listExercisesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listExercisesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.exercises);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.exercises);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  displayName: string;
  email?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ displayName: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@dataconnect/generated';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  displayName: ..., 
  email: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ displayName: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateWorkout
You can execute the `CreateWorkout` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createWorkout(vars: CreateWorkoutVariables): MutationPromise<CreateWorkoutData, CreateWorkoutVariables>;

interface CreateWorkoutRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkoutVariables): MutationRef<CreateWorkoutData, CreateWorkoutVariables>;
}
export const createWorkoutRef: CreateWorkoutRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createWorkout(dc: DataConnect, vars: CreateWorkoutVariables): MutationPromise<CreateWorkoutData, CreateWorkoutVariables>;

interface CreateWorkoutRef {
  ...
  (dc: DataConnect, vars: CreateWorkoutVariables): MutationRef<CreateWorkoutData, CreateWorkoutVariables>;
}
export const createWorkoutRef: CreateWorkoutRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createWorkoutRef:
```typescript
const name = createWorkoutRef.operationName;
console.log(name);
```

### Variables
The `CreateWorkout` mutation requires an argument of type `CreateWorkoutVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateWorkoutVariables {
  workoutDate: DateString;
  durationMinutes?: number | null;
  notes?: string | null;
}
```
### Return Type
Recall that executing the `CreateWorkout` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateWorkoutData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateWorkoutData {
  workout_insert: Workout_Key;
}
```
### Using `CreateWorkout`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createWorkout, CreateWorkoutVariables } from '@dataconnect/generated';

// The `CreateWorkout` mutation requires an argument of type `CreateWorkoutVariables`:
const createWorkoutVars: CreateWorkoutVariables = {
  workoutDate: ..., 
  durationMinutes: ..., // optional
  notes: ..., // optional
};

// Call the `createWorkout()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createWorkout(createWorkoutVars);
// Variables can be defined inline as well.
const { data } = await createWorkout({ workoutDate: ..., durationMinutes: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createWorkout(dataConnect, createWorkoutVars);

console.log(data.workout_insert);

// Or, you can use the `Promise` API.
createWorkout(createWorkoutVars).then((response) => {
  const data = response.data;
  console.log(data.workout_insert);
});
```

### Using `CreateWorkout`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createWorkoutRef, CreateWorkoutVariables } from '@dataconnect/generated';

// The `CreateWorkout` mutation requires an argument of type `CreateWorkoutVariables`:
const createWorkoutVars: CreateWorkoutVariables = {
  workoutDate: ..., 
  durationMinutes: ..., // optional
  notes: ..., // optional
};

// Call the `createWorkoutRef()` function to get a reference to the mutation.
const ref = createWorkoutRef(createWorkoutVars);
// Variables can be defined inline as well.
const ref = createWorkoutRef({ workoutDate: ..., durationMinutes: ..., notes: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createWorkoutRef(dataConnect, createWorkoutVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.workout_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.workout_insert);
});
```

