import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import App from './App';
import loggerMiddleware from './lib/loggerMiddleware';
import reducers from './lib/reducers';
import socketMiddleware from './lib/socketMiddleware';

const store = createStore(reducers, applyMiddleware(loggerMiddleware, socketMiddleware));

render((
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>
), document.getElementById('page'));
