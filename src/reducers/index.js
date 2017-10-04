import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from './auth_reducer';
import cardsReducer from './cards_reducer';
import transactionReducer from './transactions_reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    routing: routerReducer,
    cards: cardsReducer,
    transactions: transactionReducer
});

export default rootReducer;
