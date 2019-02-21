import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import reducers from './lib/reducers';
import App from './App';

import './index.html';

const store = createStore(reducers, applyMiddleware(thunk));
store.subscribe(() => console.log(store.getState()));

render((
  <Provider store={store}>
    <MuiThemeProvider>
      <App />
    </MuiThemeProvider>
  </Provider>
), document.getElementById('page'));