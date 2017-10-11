import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'emotion/react';

import { fetchCards, changeActiveCard } from '../../actions/cards';
import { getPreparedCards } from '../../selectors/cards';

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

  renderCards = () => this.props.isLoading ? (<div/>)
    : (this.props.cards.map(card => (
      <Card key={ card.id } data={ card } active={ card.id === this.props.activeCardId } onClick={ () => this.props.onClick(card.id) } />
    )));

  render = () => (
    <Layout>
      <Logo />
      <Edit />
      <CardsList>
        { this.renderCards() }
        { this.props.isLoading ? <div/> : <Card type='new' /> }
      </CardsList>
      <Footer>Yamoney Node School</Footer>
    </Layout>
  )
}

CardsBar.propTypes = {
  cards: PropTypes.array.isRequired,
  activeCardId: PropTypes.number,
  error: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  cards: getPreparedCards(state),
  error: state.cards.error,
  activeCardId: state.cards.activeCardId,
  isLoading: state.cards.isLoading
});

const mapDispatchToProps = dispatch => ({
  onClick: (id) => dispatch(changeActiveCard(id)),
  onStart: () => dispatch(fetchCards())
});

export default connect(mapStateToProps, mapDispatchToProps)(CardsBar);
