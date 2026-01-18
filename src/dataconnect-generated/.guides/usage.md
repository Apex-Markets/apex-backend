# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, getWorkout, createWorkout, listExercises } from '@dataconnect/generated';


// Operation CreateUser:  For variables, look at type CreateUserVars in ../index.d.ts
const { data } = await CreateUser(dataConnect, createUserVars);

// Operation GetWorkout:  For variables, look at type GetWorkoutVars in ../index.d.ts
const { data } = await GetWorkout(dataConnect, getWorkoutVars);

// Operation CreateWorkout:  For variables, look at type CreateWorkoutVars in ../index.d.ts
const { data } = await CreateWorkout(dataConnect, createWorkoutVars);

// Operation ListExercises: 
const { data } = await ListExercises(dataConnect);


```