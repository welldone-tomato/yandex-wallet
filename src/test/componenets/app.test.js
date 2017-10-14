import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import moxios from 'moxios';

import App from '../../components/app';
import { cardsInitialState } from '../../reducers/cards_reducer';
import { authInitialState } from '../../reducers/auth_reducer';
import { transactionsInitialState } from '../../reducers/transactions_reducer';
import { API_END_POINT, cards, transactions, initLocalStorage } from '../common';

const initialState = {
  auth: authInitialState,
  cards: cardsInitialState,
  transactions: transactionsInitialState
};

configure({
  adapter: new Adapter()
});

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

initLocalStorage();

describe('Render whole App with initital state', () => {
  let store,
    wrapper;

  afterEach(() => moxios.uninstall());

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

    store = mockStore(initialState);
    wrapper = mount(<Provider store={ store }>
                      <App />
                    </Provider>);
  });

  it('+++ render the connected component', () => {
    expect(wrapper.find(App).length).toEqual(1);
  });
});