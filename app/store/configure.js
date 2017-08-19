import rootReducer from '../reducers';
import { applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { sagas, sagaMiddleware } from '../sagas';

let createStore = require('./create-store');
const createStoreWithMiddleware = applyMiddleware(apiMiddleware, sagaMiddleware)(createStore);

export default function configureStore (initialState) {
  let store = createStoreWithMiddleware(rootReducer, initialState);

  // Start all sagas.
  for (let saga of sagas) {
    sagaMiddleware.run(saga);
  }

  return store;
}
