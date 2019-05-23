import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './index.css';
import App from './app';
import store from './store';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path='/' component={App}/>
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('root'));

serviceWorker.unregister();
