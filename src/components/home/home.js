import React from 'react';
import { connect } from 'react-redux';
import styled from 'emotion/react';

import History from './history';
import MobilePayment from './mpayment/mobile_payment';
import Prepaid from './prepaid/prepaid';
import Withdraw from './withdraw/withdraw';

import { getActiveCard } from '../../selectors/cards';
import { getTransactionsByDays } from '../../selectors/transactions';

const Workspace = styled.div`
display: flex;
flex-wrap: wrap;
max-width: 970px;
padding: 15px;
`;

const Home = ({transactions, activeCard}) => ( <Workspace>
                                                 <History transactions={ transactions } activeCard={ activeCard } />
                                                 <Prepaid />
                                                 <MobilePayment />
                                                 <Withdraw />
                                               </Workspace>
);

const mapStateToProps = state => ({
  transactions: getTransactionsByDays(state),
  activeCard: getActiveCard(state)
});

export default connect(mapStateToProps)(Home);
