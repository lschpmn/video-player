import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from './App';
import reducers from './lib/reducers';
import socketMiddleware from './lib/socketMiddleware';

import './index.html';

const store = createStore(reducers, applyMiddleware(thunk, socketMiddleware));
store.subscribe(() => console.log(store.getState()));

render((
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>
), document.getElementById('page'));