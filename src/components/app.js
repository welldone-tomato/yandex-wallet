import React from 'react';

import styled from 'emotion/react';
import { injectGlobal } from 'emotion';

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
        { props.children }
      </CardPane>
    </Wallet>
    );
};

export default App;
