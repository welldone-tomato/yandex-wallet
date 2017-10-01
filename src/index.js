import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

// Middlewares
import reduxThunk from 'redux-thunk';

// Other
import registerServiceWorker from './registerServiceWorker';

// Components
import App from './components/app';
import Cards from './components/cards';
import Home from './components/home';
import Err404 from './components/err404';
import SignIn from './components/auth/signin';

import reducers from './reducers';

//
const middlewares = [reduxThunk, routerMiddleware(browserHistory)];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(...middlewares)));

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={ store }>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <Router history={ history }>
      <Route path="/" component={ App }>
        <IndexRoute component={ Home } />
        <Route path="/cards" component={ Cards } />
      </Route>
      <Route path="/signin" component={ SignIn } />
      <Route path='*' exact={ true } component={ Err404 } />
    </Router>
  </Provider>, document.getElementById('root'));

registerServiceWorker();
