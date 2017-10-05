import React from 'react';
import { connect } from 'react-redux';
import styled from 'emotion/react';

import History from './history';
import MobilePayment from './mpayment/mobile_payment';

import { mobilePayment } from '../../actions/';

const Workspace = styled.div`
display: flex;
flex-wrap: wrap;
max-width: 970px;
padding: 15px;
`;

const Home = ({transactions, activeCard, onMobilePaymentClick}) => {
  return ( <Workspace>
             <History cardHistory={ transactions } activeCard={ activeCard } />
             <MobilePayment activeCard={ activeCard } onMobilePaymentClick={ onMobilePaymentClick } />
           </Workspace>
    );
};

const mapStateToProps = state => {
  return {
    transactions: state.transactions.data,
    activeCard: state.cards.activeCard
  }
};

const mapDispatchToProps = dispatch => {
  return {
    onMobilePaymentClick: (transaction, id) => dispatch(mobilePayment(transaction, id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
