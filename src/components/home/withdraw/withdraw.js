import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import WithdrawContract from './withdraw_contract';
import { WithdrawSuccess, WithdrawError } from './withdraw_screens';

import { getFilteredCards } from '../../../selectors/cards';
import { payWithdraw, repeateWithdrawTransfer } from '../../../actions/payments';

const Withdraw = props => {
    const {paymentState, onRepeatPaymentClick, onPaymentSubmit, activeCardId, inactiveCardsList} = props;

    if (paymentState.stage === 'success')
        return (<WithdrawSuccess transaction={ paymentState.transaction } repeatPayment={ () => onRepeatPaymentClick() } />);
    else if (paymentState.stage === 'contract')
        return (<WithdrawContract activeCardId={ activeCardId } inactiveCardsList={ inactiveCardsList } onPaymentSubmit={ (transaction, id, toId) => onPaymentSubmit(transaction, id, toId) } />);
    else return (<WithdrawError transaction={ paymentState.transaction } error={ paymentState.error } repeatPayment={ () => onRepeatPaymentClick() } />);
}

Withdraw.propTypes = {
    paymentState: PropTypes.object,
    activeCardId: PropTypes.string,
    inactiveCardsList: PropTypes.arrayOf(PropTypes.object),
    onPaymentSubmit: PropTypes.func.isRequired,
    onRepeatPaymentClick: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    paymentState: state.payments.withdrawPayment,
    activeCardId: state.cards.activeCardId,
    inactiveCardsList: getFilteredCards(state)
});

const mapDispatchToProps = dispatch => ({
    /**
       * Обработка успешного платежа
       * @param {Object} transaction данные о транзакции
       */
    onPaymentSubmit: (transaction, id, toId) => dispatch(payWithdraw(transaction, id, toId)),

    /**
       * Повторить платеж
       */
    onRepeatPaymentClick: () => dispatch(repeateWithdrawTransfer())
});

export default connect(mapStateToProps, mapDispatchToProps)(Withdraw);
