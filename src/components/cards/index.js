import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchCards } from '../../actions';

import './cards.css';
import visa from './visa-logo.png';
import mastercard from './mastercard-logo.png';

class Cards extends Component {
  cardTypes = {
    VISA: 'visa',
    MAESTRO: 'maestro',
    MASTERCARD: 'mastercard',
    MIR: 'mir'
  }

  /**
   * Проверяет тип карты
   * @param {Number} val номер карты
   * @returns {String} тип карты
   */
  getCardType(val) {
    // Бины ПС МИР 220000 - 220499
    const mirBin = /^220[0-4]\s?\d\d/;

    const firstNum = val[0];

    switch (firstNum) {
      case '2': {
        if (mirBin.test(val)) {
          return this.cardTypes.MIR;
        } else {
          return '';
        }
      }
      case '4': {
        return this.cardTypes.VISA;
      }
      case '5': {
        const secondNum = val[1] || '';

        if (secondNum === '0' || secondNum > '5') {
          return this.cardTypes.MAESTRO;
        } else {
          return this.cardTypes.MASTERCARD;
        }
      }
      case '6': {
        return this.cardTypes.MAESTRO;
      }
      default: {
        return '';
      }
    }
  }

  /**
	 * Форматирует номер карты, используя заданный разделитель
	 *
	 * @param {String} cardNumber номер карты
	 * @param {String} delimeter = '\u00A0' разделитель
	 * @returns {String} форматированный номер карты
	 */
  formatCardNumber(cardNumber, delimeter = '\u00A0') {
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

  componentDidMount() {
    this.props.fetchCards();
  }

  returnLogo(card) {
    switch (this.getCardType(card)) {
      case this.cardTypes.VISA:
        return (<img src={ visa } className="card__logo" alt="" />)

      case this.cardTypes.MASTERCARD:
        return (<img src={ mastercard } className="card__logo" alt="" />)

      default:
        return (<img src={ visa } className="card__logo" alt="" />)
    }

  }

  renderCard(cards) {
    const cardList = cards.map(card => {
      return (
        <div className="column">
          <div className="card">
            <header className="card-header">
              <p className="card-header-title">
                { this.formatCardNumber(card) }
              </p>
            </header>
            <div className="card-content">
              <div className="content">
                <div className="card-credit card--front">
                  <div className="card__number">
                    { this.formatCardNumber(card) }
                  </div>
                  <div className="card__expiry-date">10/17</div>
                  <div className="card__owner">Jane Doe</div>
                  { this.returnLogo(card) }
                </div>
              </div>
            </div>
            <footer className="card-footer">
              <a className="card-footer-item">Save</a>
              <a className="card-footer-item">Edit</a>
              <a className="card-footer-item">Delete</a>
            </footer>
          </div>
        </div>
      )
    });


    return cardList;
  }

  render() {
    return (
      <div className="columns is-mobile">
        { this.renderCard(this.props.cards) }
      </div>
      );
  }
}

const mapStateToProps = state => {
  return {
    cards: state.cards
  }
}

export default connect(mapStateToProps, {
  fetchCards
})(Cards);
