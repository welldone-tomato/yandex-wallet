import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from './auth';
import cardsReducer from './cards';

const rootReducer = combineReducers({
    auth: authReducer,
    routing: routerReducer,
    cards: cardsReducer
});

export default rootReducer;
