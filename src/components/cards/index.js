import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchCards, fetchTransactions } from '../../actions';

import './cards.css';
import visa from './visa-logo.png';
import mastercard from './mastercard-logo.png';

import TransactionTable from './transactionTable';

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

  componentDidMount = () => this
    .props
    .dispatch(fetchCards());

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
    const initStyle = {
      minWidth: '466px',
      maxWidth: '466px',
      cursor: 'pointer',
      backgroundColor: 'white'
    };

    const cardList = cards.map(card => {
      let st;
      if (this.props.transactions.id === card.id)
        st = {
          ...initStyle,
          backgroundColor: 'coral'
      }
      else
        st = initStyle;

      return (
        <div className="tile is-child box" key={ card.id } style={ st } onClick={ () => this.props.dispatch(fetchTransactions(card.id)) }>
          <div className="content">
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
      <div className="section">
        <div className="container">
          <h1 className="title">Список ваших карт</h1>
          <h2 className="subtitle">Список карт, транзакций по ним и добавление операций</h2>
          <hr/>
          { this.props.cards.error && <div className="notification is-danger">
                                        <button className="delete"></button>Произошла проблема при получении данных. Попробуйте еще раз через некоторое время.
                                      </div> }
          { this.props.cards.data && <div className="tile is-ancestor">
                                       <div className="tile is-6 is-vertical is-parent">
                                         { this.renderCard(this.props.cards.data) }
                                       </div>
                                       <div className="tile is-parent">
                                         <div className="tile is-child box">
                                           <p className="title">Транзакции</p>
                                           { this.props.transactions.error && <div className="notification is-danger">
                                                                                <button className="delete"></button>Произошла проблема при получении данных. Попробуйте еще раз через некоторое время.
                                                                              </div> }
                                           <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam semper diam at erat pulvinar, at pulvinar felis blandit. Vestibulum volutpat tellus diam, consequat
                                             gravida libero rhoncus ut. Morbi maximus, leo sit amet vehicula eleifend, nunc dui porta orci, quis semper odio felis ut quam.</p>
                                           <TransactionTable data={ this.props.transactions.data } />
                                         </div>
                                       </div>
                                     </div> }
        </div>
      </div>
      );
  }
}


const mapStateToProps = ({cards, transactions}) => ({
  cards,
  transactions
});

export default connect(mapStateToProps)(Cards);
