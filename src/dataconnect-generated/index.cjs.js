const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'apex-backend',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
};

const getWorkoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetWorkout', inputVars);
}
getWorkoutRef.operationName = 'GetWorkout';
exports.getWorkoutRef = getWorkoutRef;

exports.getWorkout = function getWorkout(dcOrVars, vars) {
  return executeQuery(getWorkoutRef(dcOrVars, vars));
};

const createWorkoutRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateWorkout', inputVars);
}
createWorkoutRef.operationName = 'CreateWorkout';
exports.createWorkoutRef = createWorkoutRef;

exports.createWorkout = function createWorkout(dcOrVars, vars) {
  return executeMutation(createWorkoutRef(dcOrVars, vars));
};

const listExercisesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListExercises');
}
listExercisesRef.operationName = 'ListExercises';
exports.listExercisesRef = listExercisesRef;

exports.listExercises = function listExercises(dc) {
  return executeQuery(listExercisesRef(dc));
};
