import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  displayName: string;
  email?: string | null;
}

export interface CreateWorkoutData {
  workout_insert: Workout_Key;
}

export interface CreateWorkoutVariables {
  workoutDate: DateString;
  durationMinutes?: number | null;
  notes?: string | null;
}

export interface Exercise_Key {
  id: UUIDString;
  __typename?: 'Exercise_Key';
}

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

export interface GetWorkoutVariables {
  id: UUIDString;
}

export interface ListExercisesData {
  exercises: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    muscleGroup?: string | null;
    equipment?: string | null;
  } & Exercise_Key)[];
}

export interface Set_Key {
  id: UUIDString;
  __typename?: 'Set_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface WorkoutExercise_Key {
  id: UUIDString;
  __typename?: 'WorkoutExercise_Key';
}

export interface Workout_Key {
  id: UUIDString;
  __typename?: 'Workout_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface GetWorkoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetWorkoutVariables): QueryRef<GetWorkoutData, GetWorkoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetWorkoutVariables): QueryRef<GetWorkoutData, GetWorkoutVariables>;
  operationName: string;
}
export const getWorkoutRef: GetWorkoutRef;

export function getWorkout(vars: GetWorkoutVariables): QueryPromise<GetWorkoutData, GetWorkoutVariables>;
export function getWorkout(dc: DataConnect, vars: GetWorkoutVariables): QueryPromise<GetWorkoutData, GetWorkoutVariables>;

interface CreateWorkoutRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateWorkoutVariables): MutationRef<CreateWorkoutData, CreateWorkoutVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateWorkoutVariables): MutationRef<CreateWorkoutData, CreateWorkoutVariables>;
  operationName: string;
}
export const createWorkoutRef: CreateWorkoutRef;

export function createWorkout(vars: CreateWorkoutVariables): MutationPromise<CreateWorkoutData, CreateWorkoutVariables>;
export function createWorkout(dc: DataConnect, vars: CreateWorkoutVariables): MutationPromise<CreateWorkoutData, CreateWorkoutVariables>;

interface ListExercisesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListExercisesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListExercisesData, undefined>;
  operationName: string;
}
export const listExercisesRef: ListExercisesRef;

export function listExercises(): QueryPromise<ListExercisesData, undefined>;
export function listExercises(dc: DataConnect): QueryPromise<ListExercisesData, undefined>;

