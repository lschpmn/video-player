'use strict';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './lib/reducers';

import './index.html';
import App from './app';

let store = createStore(reducers);

render(<Provider store={store}>
  <App />
</Provider>, document.getElementById('page'));