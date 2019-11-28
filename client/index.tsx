import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import App from './App';
import loggerMiddleware from './lib/loggerMiddleware';
import reducers from './lib/reducers';
import socketMiddleware from './lib/socketMiddleware';

const store = createStore(reducers, applyMiddleware(loggerMiddleware, socketMiddleware));
const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue['500'],
    },
    secondary: {
      main: green['500'],
    },
    error: {
      main: red['500'],
    },
    type: 'light',
  },
});

render((
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </Provider>
), document.getElementById('page'));
