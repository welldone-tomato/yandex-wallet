import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import authReducer from './auth_reducer';
import cardsReducer from './cards_reducer';
import mrs_reducer from './mrs_reducer';
import transactionReducer from './transactions_reducer';
import mobilePaymentReducer from './mobile_payment_reducer';
import prepaidPaymentReducer from './prepaid_payment_reducer';
import withdrawPaymentReducer from './withdraw_payment_reducer';
import currencyReducer from './currency_reducer';
import card2UserReducer from './card2user_payment_reducer';
import userReducer from './user_reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    routing: routerReducer,
    cards: cardsReducer,
    transactions: transactionReducer,
    payments: combineReducers({
        mobilePayment: mobilePaymentReducer,
        prepaidPayment: prepaidPaymentReducer,
        withdrawPayment: withdrawPaymentReducer,
        card2User: card2UserReducer
    }),
    mrs: mrs_reducer,
    currency: currencyReducer,
    user: userReducer
});

export default rootReducer;
