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
  font-family: 'Open Sans';
  color: #000;
  background-color: rgba(36, 36, 36, 0.75);
}
`;

const Wallet = styled.div`
display: flex;
min-height: 100%;
background-color: #fcfcfc;
width: 94%;
margin: 0px auto;
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
