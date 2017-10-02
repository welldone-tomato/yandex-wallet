import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchCards } from '../../actions';

import './cards.css';
import visa from './visa-logo.png';
import mastercard from './mastercard-logo.png';

class Cards extends Component {
  /**
	 * Форматирует номер карты, используя заданный разделитель
	 *
	 * @param {String} cardNumber номер карты
	 * @param {String} delimeter = '\u00A0' разделитель
	 * @returns {String} форматированный номер карты
	 */
  formatCardNumber = (cardNumber, delimeter = '\u00A0') => {
    let formattedCardNumber = [];
    if (cardNumber) {
      while (cardNumber && typeof cardNumber === 'string') {
        formattedCardNumber.push(cardNumber.substr(0, 4));
        cardNumber = cardNumber.substr(4);
        if (cardNumber) {
          formattedCardNumber.push(delimeter);
        }
      }
    }
    return formattedCardNumber.join('');
  }

  componentDidMount = () => this.props.fetchCards();

  returnLogo = ({type}) => {
    switch (type) {
      case 'visa':
        return (<img src={ visa } className="card__logo" alt="" />)

      case 'mastercard':
        return (<img src={ mastercard } className="card__logo" alt="" />)

      default:
        return (<img src={ visa } className="card__logo" alt="" />)
    }
  }

  renderCard = cards => {
    const cardList = cards.map(card => {
      return (
        <div className="card-credit card--front">
          <div className="card__number">
            { this.formatCardNumber(card.cardNumber) }
          </div>
          <div className="card__expiry-date">
            { card.exp }
          </div>
          <div className="card__owner">
            { card.name }
          </div>
          { this.returnLogo(card) }
        </div>
      )
    });

    return cardList;
  }

  render() {
    return (
      <div className="columns is-mobile">
        <div className="column is-half">
          { this.renderCard(this.props.cards) }
        </div>
        <div className="column"></div>
      </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    cards: state.cards.data,
    error: state.cards.error
  }
}

export default connect(mapStateToProps, {
  fetchCards
})(Cards);
