import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'emotion/react';

import { changeActiveCard, deleteCard, addCard } from '../../actions/cards';
import { getPreparedCards } from '../../selectors/cards';

import Card from './card';
import CardDelete from './card_delete';
import CardAdd from './card_add';
import CardPayme from './card_payme';

const Layout = styled.div`
width: 310px;
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
  top: 17px;
  right: 12px;
  width: 34px;
  height: 35px;
  cursor: pointer;
  background-image: url('/assets/${({editable}) => editable ? 'cards-edit-active' : 'cards-edit'}.svg');
  background-repeat: no-repeat;
  background-position: center center;
`;

const PaymeButton = styled.div`
position: absolute;
top: 25px;
right: 57px;
width: 20px;
height: 20px;
cursor: pointer;
background-image: url('/assets/${({editable}) => editable ? 'cards-share-active' : 'cards-share'}.png');
background-repeat: round;
`;

const CardsList = styled.div`
  flex: 1;
  font-size: 15px;
`;

const Footer = styled.footer`
color: rgba(255, 255, 255, 0.2);
font-size: 15px;
`;

class CardsBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      removeCardId: '',
      shareCardId: '',
      isCardRemoving: false,
      isCardsEditable: false,
      isCardsPaymeIconActive: false,
      isCardAdding: false,
      isCardPayme: false
    }
  }

  /**
	* Обработчик события редактирования карт
	* @param {Boolean} isEditable Признак редактируемости
	*/
  onEditChange = isEditable => {
    const isCardsEditable = !isEditable;
    this.setState({
      isCardsEditable,
      isCardRemoving: false
    });
  }

  /**
	* Обработчик события нажатия иконки шаринга карт
	* @param {Boolean} isEditable Признак редактируемости
	*/
  onEditPaymeIcon = isEditable => {
    const isCardsPaymeIconActive = !isEditable;
    this.setState({
      isCardsPaymeIconActive,
      isCardPayme: false
    });
  }

  onSetDeleteMode = (event, removeCardId) => {
    event.stopPropagation();
    this.setState({
      isCardRemoving: true,
      removeCardId
    });
  }

  onSetAddMode = event => {
    event.stopPropagation();
    this.setState({
      isCardAdding: true
    });
  }

  onSetPaymeMode = (event, shareCardId) => {
    event.stopPropagation();
    this.setState({
      isCardPayme: true,
      shareCardId
    });
  }

  onCancelMode = () => {
    this.setState({
      isCardRemoving: false,
      isCardsEditable: false,
      isCardAdding: false,
      isCardPayme: false
    });
  }

  onDeleteClickWrapper = id => {
    this.setState({
      isCardRemoving: false,
      removeCardId: '',
      isCardsEditable: false
    });
    this.props.onDeleteClick(id);
  }

  onAddClickWrapper = (cardNumber, exp, name) => {
    this.setState({
      isCardAdding: false
    });
    this.props.onAddClick(cardNumber, exp, name);
  }

  onCreateMRClickWrapper = (sum, goal) => {
    this.setState({
      isCardPayme: false,
      shareCardId: '',
      isCardsPaymeIconActive: false
    });
  // this.props.onAddClick(cardNumber, exp, name);
  }

  renderCards = () => {
    const {isLoading, cards, activeCardId, onClick} = this.props;

    return isLoading ? (<div/>)
      : (cards.map(card => (
        <Card key={ card.id } data={ card } active={ card.id === activeCardId } onClick={ () => onClick(card.id) } onChangeDeleteMode={ (e, id) => this.onSetDeleteMode(e, id) } onChangePaymeMode={ (e, id) => this.onSetPaymeMode(e, id) }
          isCardsEditable={ this.state.isCardsEditable } isCardsPaymeIconActive={ this.state.isCardsPaymeIconActive } />
      )))
  };

  render = () => {
    const {isCardsEditable, isCardsPaymeIconActive, isCardRemoving, isCardAdding, isCardPayme, removeCardId} = this.state;
    const {isLoading, cards, isAuth} = this.props;

    if (!isAuth)
      return (
        <Layout>
          <Logo />
        </Layout>);

    if (isCardRemoving)
      return (
        <Layout>
          <Logo />
          <CardDelete onCancelClick={ () => this.onCancelMode() } deleteCard={ id => this.onDeleteClickWrapper(id) } data={ cards.filter((item) => item.id === removeCardId)[0] } />
          <Footer>Yamoney Node School</Footer>
        </Layout>);

    if (isCardAdding)
      return (
        <Layout>
          <Logo />
          <CardAdd onCancelClick={ () => this.onCancelMode() } addCard={ (cardNumber, exp, name) => this.onAddClickWrapper(cardNumber, exp, name) } />
          <Footer>Yamoney Node School</Footer>
        </Layout>);

    if (isCardPayme)
      return (
        <Layout>
          <Logo />
          <CardPayme onCancelClick={ () => this.onCancelMode() } createPayMe={ (sum, goal) => this.onCreateMRClickWrapper(sum, goal) } />
          <Footer>Yamoney Node School</Footer>
        </Layout>);

    return (
      <Layout>
        <Logo />
        <Edit onClick={ () => this.onEditChange(isCardsEditable) } editable={ isCardsEditable } />
        <PaymeButton onClick={ () => this.onEditPaymeIcon(isCardsPaymeIconActive) } editable={ isCardsPaymeIconActive } />
        <CardsList>
          { this.renderCards() }
          { isLoading ? <div/> : <Card type='new' onChangeAddMode={ (e) => this.onSetAddMode(e) } /> }
        </CardsList>
        <Footer>Yamoney Node School</Footer>
      </Layout>
    )
  }
}

CardsBar.propTypes = {
  cards: PropTypes.array.isRequired,
  activeCardId: PropTypes.string,
  error: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  cards: getPreparedCards(state),
  error: state.cards.error,
  activeCardId: state.cards.activeCardId,
  isLoading: state.cards.isLoading,
  isAuth: state.auth.isAuth
});

const mapDispatchToProps = dispatch => ({
  onClick: id => dispatch(changeActiveCard(id)),
  onDeleteClick: id => dispatch(deleteCard(id)),
  onAddClick: (cardNumber, exp, name) => dispatch(addCard(cardNumber, exp, name))
});

export default connect(mapStateToProps, mapDispatchToProps)(CardsBar);
