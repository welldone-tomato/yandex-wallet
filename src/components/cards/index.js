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
    const st = {
      minWidth: '466px',
      maxWidth: '466px',
      cursor: 'pointer'
    }

    const cardList = cards.map(card => {
      return (
        <div className="tile is-child box" key={ card.id } style={ st }>
          <div class="content">
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
          </div>
        </div>
      )
    });

    return cardList;
  }

  render() {
    return (
      <div className="container">
        <h1 className="title">Список ваших карт</h1>
        <h2 className="subtitle">Список карт, транзакций по ним и добавление операций</h2>
        <hr/>
        { this.props.error && <div className="notification is-danger">
                                <button className="delete"></button>Произошла проблема при получении данных. Попробуйте еще раз через некоторое время.
                              </div> }
        { this.props.cards && <div className="tile is-ancestor">
                                <div className="tile is-6 is-vertical is-parent">
                                  { this.renderCard(this.props.cards) }
                                </div>
                                <div className="tile is-parent">
                                  <div className="tile is-child box">
                                    <p className="title">Three</p>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat
                                      gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.</p>
                                    <p>Suspendisse varius ligula in molestie lacinia. Maecenas varius eget ligula a sagittis. Pellentesque interdum, nisl nec interdum maximus, augue diam porttitor
                                      lorem, et sollicitudin felis neque sit amet erat. Maecenas imperdiet felis nisi, fringilla luctus felis hendrerit sit amet. Aenean vitae gravida diam, finibus
                                      dignissim turpis. Sed eget varius ligula, at volutpat tortor.</p>
                                    <p>Integer sollicitudin, tortor a mattis commodo, velit urna rhoncus erat, vitae congue lectus dolor consequat libero. Donec leo ligula, maximus et pellentesque
                                      sed, gravida a metus. Cras ullamcorper a nunc ac porta. Aliquam ut aliquet lacus, quis faucibus libero. Quisque non semper leo.</p>
                                  </div>
                                </div>
                              </div> }
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
