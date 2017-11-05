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
min-height: 863px;
background-color: #fcfcfc;
width: 94%;
margin: 0px auto;
@media (min-width: 1200px) { /* стиль имеет смысл, когда ширина экрана больше 1200px, к тому же не нужно придумывать решения для IE7 и ниже */ 
  width: 60%;
}
min-width: 1080px;
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
