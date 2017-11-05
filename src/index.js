import React from 'react';
import ReactDOM from 'react-dom';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware, routerActions } from 'react-router-redux';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history3/redirect'

// Middlewares
import reduxThunk from 'redux-thunk';

// Other
import registerServiceWorker from './registerServiceWorker';

// Components
import App from './components/app';
import Home from './components/home/home';
import Err404 from './components/err404';
import SignIn from './components/auth/signin';
import SignUp from './components/auth/signup';

import reducers from './reducers';
import { verifyToken } from './actions/auth';

// Websockets
import Websockets from './websockets';

//
const middlewares = [reduxThunk, routerMiddleware(browserHistory)];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducers, composeEnhancers(applyMiddleware(...middlewares)));
const history = syncHistoryWithStore(browserHistory, store);

Websockets.init(store);

////////
store.dispatch(verifyToken());

const userIsAuthenticated = connectedRouterRedirect({
  redirectPath: '/signin',
  authenticatedSelector: state => state.auth.isAuth,
  wrapperDisplayName: 'UserIsAuthenticated',
  redirectAction: routerActions.replace
});

ReactDOM.render(
  <Provider store={ store }>
    <Router history={ history }>
      <Route path="/" component={ App }>
        <IndexRoute component={ userIsAuthenticated(Home) } />
        <Route path="signin" component={ SignIn } />
        <Route path="signup" component={ SignUp } />
      </Route>
      <Route path='*' exact={ true } component={ Err404 } />
    </Router>
  </Provider>, document.getElementById('root'));

registerServiceWorker();
