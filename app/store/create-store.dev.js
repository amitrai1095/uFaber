import { createStore, compose } from 'redux';
import DevTools from '../containers/DevTools';

let devMiddleware = DevTools.instrument();

module.exports = compose(devMiddleware)(createStore);
