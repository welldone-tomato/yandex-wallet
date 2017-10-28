import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'emotion/react';

import { fetchCards, changeActiveCard, deleteCard } from '../../actions/cards';
import { getPreparedCards } from '../../selectors/cards';

import Card from './card';
import CardDelete from './card_delete';

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
  top: 17px;
  right: 12px;
  width: 34px;
  height: 35px;
  cursor: pointer;
  background-image: url('/assets/${({editable}) => editable ? 'cards-edit-active' : 'cards-edit'}.svg');
  background-repeat: no-repeat;
  background-position: center center;
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
      removeCardId: 0,
      isCardRemoving: false,
      isCardsEditable: false
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

  onChangeBarMode = (event, removeCardId) => {
    event.stopPropagation();
    this.setState({
      isCardRemoving: true,
      removeCardId
    });
  }

  onCancelBarMode = () => {
    this.setState({
      isCardRemoving: false,
      isCardsEditable: false
    });
  }

  onDeleteClickWrapper = id => {
    this.setState({
      isCardRemoving: false,
      removeCardId: 0,
      isCardsEditable: false
    });
    this.props.onDeleteClick(id);
  }

  componentDidMount = () => {
    if (this.props.isAuth)
      this
        .props
        .onStart();
  }

  renderCards = () => {
    const {isLoading, cards, activeCardId, onClick} = this.props;

    return isLoading ? (<div/>)
      : (cards.map(card => (
        <Card key={ card.id } data={ card } active={ card.id === activeCardId } onClick={ () => onClick(card.id) } onChangeBarMode={ (e, id) => this.onChangeBarMode(e, id) } isCardsEditable={ this.state.isCardsEditable }
        />
      )))
  };

  render = () => {
    const {isCardsEditable, isCardRemoving, removeCardId} = this.state;
    const {isLoading, cards} = this.props;

    if (isCardRemoving) {
      return (
        <Layout>
          <Logo />
          <CardDelete onCancelClick={ () => this.onCancelBarMode() } deleteCard={ id => this.onDeleteClickWrapper(id) } data={ cards.filter((item) => item.id === removeCardId)[0] } />
          <Footer>Yamoney Node School</Footer>
        </Layout>);
    }

    return (
      <Layout>
        <Logo />
        <Edit onClick={ () => this.onEditChange(isCardsEditable) } editable={ isCardsEditable } />
        <CardsList>
          { this.renderCards() }
          { isLoading ? <div/> : <Card type='new' /> }
        </CardsList>
        <Footer>Yamoney Node School</Footer>
      </Layout>
    )
  }
}

CardsBar.propTypes = {
  cards: PropTypes.array.isRequired,
  activeCardId: PropTypes.string,
  error: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
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
  onStart: () => dispatch(fetchCards()),
  onDeleteClick: id => dispatch(deleteCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(CardsBar);
