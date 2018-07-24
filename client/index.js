'use strict';

require("babel-core/register");
require('babel-polyfill');
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducers from './lib/reducers';

import injectTapEventPlugin from 'react-tap-event-plugin';
import 'font-awesome/css/font-awesome.min.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import './index.html';
import App from './app';

const store = createStore(reducers, applyMiddleware(thunk));
store.subscribe(() => console.log(store.getState()));

render((
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>
), document.getElementById('page'));