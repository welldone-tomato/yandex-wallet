import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from './auth';
import cardsReducer from './cards';
import transactionReducer from './transactions';

const rootReducer = combineReducers({
    auth: authReducer,
    routing: routerReducer,
    cards: cardsReducer,
    transactions: transactionReducer
});

export default rootReducer;
