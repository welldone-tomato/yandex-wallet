import React from 'react';
import { connect } from 'react-redux';
import styled from 'emotion/react';

import History from './history';
import MobilePayment from './mpayment/mobile_payment';

import { payMobile, repeateMobileTransfer } from '../../actions/payments';

const Workspace = styled.div`
display: flex;
flex-wrap: wrap;
max-width: 970px;
padding: 15px;
`;

const Home = ({transactions, activeCard, onMobilePaymentClick, mobilePayment, onRepeatPaymentClick}) => {
  return ( <Workspace>
             <History transactions={ transactions } activeCard={ activeCard } />
             <MobilePayment activeCard={ activeCard } onMobilePaymentClick={ onMobilePaymentClick } onRepeatPaymentClick={ onRepeatPaymentClick } mobilePaymentState={ mobilePayment }
             />
           </Workspace>
    );
};

const mapStateToProps = state => {
  return {
    transactions: state.transactions.data,
    activeCard: state.cards.activeCard,
    mobilePayment: state.mobilePayment
  }
};

const mapDispatchToProps = dispatch => {
  return {
    /**
	 * Обработка успешного платежа
	 * @param {Object} transaction данные о транзакции
	 */
    onMobilePaymentClick: (transaction, id) => dispatch(payMobile(transaction, id)),

    /**
	 * Повторить платеж
	 */
    onRepeatPaymentClick: () => dispatch(repeateMobileTransfer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
