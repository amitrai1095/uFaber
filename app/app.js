import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import routes from './routes';
import configureStore from './store/configure';

const rootComponent = <Root routes={ routes } store={ configureStore() } />;
const appMountPoint = document.getElementById('app');

// Render the app
ReactDOM.render(rootComponent, appMountPoint);
