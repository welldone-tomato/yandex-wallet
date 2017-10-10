import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'emotion/react';

import { fetchCards, changeActiveCard } from '../../actions/cards';

import Card from './card';

const Layout = styled.div`
display: flex;
flex-direction: column;
position: relative;
background-color: #242424;
padding: 20px;
`;

const Logo = styled.div`
width: 147px;
height: 28px;
margin-bottom: 55px;
background-image: url('/assets/yamoney-logo.svg');
`;

const Edit = styled.div`
position: absolute;
top: 25px;
right: 20px;
width: 18px;
height: 18px;
background-image: url('/assets/cards-edit.svg');
`;

const CardsList = styled.div`
flex: 1;
`;

const Footer = styled.footer`
color: rgba(255, 255, 255, 0.2);
font-size: 15px;
`;

class CardsBar extends Component {
  componentDidMount = () => this
    .props
    .onStart();

  render() {
    return (
      <Layout>
        <Logo />
        <Edit />
        <CardsList>
          { this.props.cards.map(card => (
              <Card key={ card.id } data={ card } active={ card.id === this.props.activeId } onClick={ () => this.props.onClick(card.id) } />
            )) }
          <Card type='new' />
        </CardsList>
        <Footer>Yamoney Node School</Footer>
      </Layout>
      );
  }
}

const mapStateToProps = ({cards}) => ({
  cards: cards.data,
  error: cards.error,
  activeId: cards.activeId
});

const mapDispatchToProps = dispatch => {
  return {
    onClick: (id) => dispatch(changeActiveCard(id)),
    onStart: () => dispatch(fetchCards())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardsBar);
