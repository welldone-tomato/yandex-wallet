import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import * as cardActions from '../../actions/cards';
import * as transactionsActions from '../../actions/transactions';
import * as types from '../../actions/types';
import { API_END_POINT, cards, transactions, initLocalStorage } from '../common';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
initLocalStorage();

describe('async actions', () => {
    beforeEach(() => {
        moxios.install();

        moxios.stubRequest(API_END_POINT + 'cards', {
            status: 200,
            response: cards
        });

        moxios.stubRequest(API_END_POINT + 'cards/1/transactions', {
            status: 200,
            response: transactions
        });
    });

    afterEach(() => moxios.uninstall());

    it('fetch cards', () => {
        const expectedActions = [
            {
                type: types.FETCH_CARDS
            },
            {
                type: types.FETCH_CARDS_SUCCESS,
                payload: cards
            },
            {
                type: types.ACTIVE_CARD_CHANGE,
                payload: 1
            },
            {
                type: types.FETCH_TRANS
            }
        ];

        const store = mockStore({
            cards: {}
        });

        return store.dispatch(cardActions.fetchCards())
            .then(() => expect(store.getActions()).toEqual(expectedActions));
    });

    it('fetch transactions', () => {
        const expectedActions = [
            {
                type: types.FETCH_TRANS
            },
            {
                type: types.FETCH_TRANS_SUCCESS,
                payload: transactions
            }
        ];

        const store = mockStore({});

        return store.dispatch(transactionsActions.fetchTransactions(1))
            .then(() => expect(store.getActions()).toEqual(expectedActions))
    });
});
