// Sagas are middleware that describe asynchronous actions or side effects in
// the app - for example, creating a new schedule or getting a list of schedules
// from the server. Sagas either run at init or listen for actions to initiate
// asynchronous behaviors. Sagas are an alternative to thunks and other
// async middleware commonly used in Redux docs and tutorials.
//
// NOTE: Don't put side effects in actions, reducers, or components! Keep side
// effects in sagas or utility functions used by sagas.
//
// https://yelouafi.github.io/redux-saga/
import createSagaMiddleware, { takeEvery } from 'redux-saga';
import authSagas from './auth-saga'
import coursesSagas from './courses-saga'
import unitsSagas from './units-saga'
import videosSagas from './videos-saga'

// Saga middleware
export let sagaMiddleware = createSagaMiddleware();

// Run all the sagas
export let sagas = [
	...authSagas,
	...coursesSagas,
	...unitsSagas,
	...videosSagas
].map(createWatcher);

// For each action/saga pair, the action should trigger the saga each time
function createWatcher (actionSagaPair) {
	return function* () {
		yield* takeEvery(...actionSagaPair);
	};
}
