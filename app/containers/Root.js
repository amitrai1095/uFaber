import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Router } from 'react-router-dom'
import { BrowserRouter, Redirect, Switch } from 'react-router-dom'
import history from '../history';

export default function Root ({ routes, store }) {
  return (
    <Provider store={ store }>
      <div>
      	<HashRouter history = { history }>
          <Switch>
            { routes }
          </Switch>
        </HashRouter>
      </div>
    </Provider>
  );
}

Root.propTypes = {
  routes: PropTypes.node.isRequired,
};
