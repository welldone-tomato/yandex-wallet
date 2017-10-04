import React from 'react';
import { connect } from 'react-redux';
import styled from 'emotion/react';

import History from './history';

const Workspace = styled.div`
display: flex;
flex-wrap: wrap;
max-width: 970px;
padding: 15px;
`;

const Home = ({transactions, activeCard}) => {
  return ( <Workspace>
             <History cardHistory={ transactions } activeCard={ activeCard } />
           </Workspace>
    );
};

const mapStateToProps = state => {
  return {
    transactions: state.transactions.data,
    activeCard: state.cards.activeCard
  }
};

export default connect(mapStateToProps)(Home);
