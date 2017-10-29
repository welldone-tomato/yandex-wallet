import React from 'react';
import { connect } from 'react-redux';

import './fonts.css';
import styled, { injectGlobal } from 'react-emotion';

import CardsBar from './cards/cards_bar';
import Header from './header/header';

injectGlobal`
html,
body {
  margin: 0;
}

#root {
  height: 100%;
  font-family: 'Open Sans';
  color: #000;
}
`;

const Wallet = styled.div`
display: flex;
min-height: 100%;
background-color: #fcfcfc;
`;

const CardPane = styled.div`
flex-grow: 1;
`;

const App = props => {
  return (
    <Wallet>
      <CardsBar />
      <CardPane>
        <Header />
        { !props.isAuthenticating && props.children }
      </CardPane>
    </Wallet>
    );
};

const mapStateToProps = state => ({
  isAuthenticating: state.auth.isAuthenticating
});

export default connect(mapStateToProps)(App);
