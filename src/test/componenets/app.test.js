import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import renderer from 'react-test-renderer'

import App from '../../components/app';
import { cardsInitialState } from '../../reducers/cards_reducer';
import { authInitialState } from '../../reducers/auth_reducer';
import { transactionsInitialState } from '../../reducers/transactions_reducer';
// import * as cardActions from '../../actions/cards';
// import * as transactionsActions from '../../actions/transactions';
import * as types from '../../actions/types';

import { API_END_POINT, cards, transactions, initLocalStorage, testAsyncAction } from '../common';

const {id} = cards[0];

beforeAll(() => {
  configure({
    adapter: new Adapter()
  });

  initLocalStorage();

  const mock = new MockAdapter(axios);

  mock.onGet(API_END_POINT + 'cards').reply(200, cards);
  mock.onDelete(API_END_POINT + `cards/${id}`).reply(200);
  mock.onGet(API_END_POINT + `cards/${id}/transactions`).reply(200, transactions);
});

describe('Render whole App with initital state', () => {
  let store,
    wrapper;

  beforeEach(() => {
    const initialState = {
      auth: authInitialState,
      cards: cardsInitialState,
      transactions: transactionsInitialState
    };

    const mockStore = configureStore([thunk]);

    store = mockStore(initialState);

    wrapper = mount(<Provider store={ store }>
                      <App />
                    </Provider>);
  });

  it('+++ capturing Snapshot of App', () => {
    const renderedValue = renderer.create(<Provider store={ store }>
                                            <App />
                                          </Provider>).toJSON()
    expect(renderedValue).toMatchSnapshot();
  });

  it('+++ render the connected component', () => {
    expect(wrapper.find(App).length).toEqual(1);
  });

  it('+++ check initial action on start', done => {

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
        payload: id
      },
      {
        type: types.FETCH_TRANS
      }
    ];

    store.dispatch(testAsyncAction())
      .then(() => {
        const actions = store.getActions();
        expect(actions).toEqual(expectedActions);
        done();
      });
  });
});
