import React from 'react';
import PropTypes from 'prop-types';
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
max-width: 1200px;
padding: 15px;
`;

const Home = ({transactions, activeCard, transactionsIsLoading}) => {
  if (activeCard) return (
      <Workspace>
        <History transactions={ transactions } activeCard={ activeCard } isLoading={ transactionsIsLoading } />
        <Prepaid />
        <MobilePayment />
        <Withdraw />
      </Workspace>
  )
  else return (<Workspace/>);
}

Home.PropTypes = {
  transactions: PropTypes.arrayOf(PropTypes.object),
  activeCard: PropTypes.object,
  transactionsIsLoading: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  transactions: getTransactionsByDays(state),
  activeCard: getActiveCard(state),
  transactionsIsLoading: state.transactions.isLoading
});

export default connect(mapStateToProps)(Home);
