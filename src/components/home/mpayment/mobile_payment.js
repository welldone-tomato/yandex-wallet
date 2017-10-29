import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import MobilePaymentContract from './mobile_payment_contract';
import { MobilePaymentSuccess, MobilePaymentError } from './mobile_payment_screens';

import { payMobile, repeateMobileTransfer } from '../../../actions/payments';

/**
 * Класс компонента MobilePayment
 */
const MobilePayment = props => {
	const {paymentState, onRepeatPaymentClick, onPaymentSubmit, activeCardId} = props;

	if (paymentState.stage === 'success')
		return (
			<MobilePaymentSuccess transaction={ paymentState.transaction } repeatPayment={ () => onRepeatPaymentClick() } />
			);
	else if (paymentState.stage === 'contract')
		return (
			<MobilePaymentContract activeCardId={ activeCardId } onPaymentSubmit={ (transaction, id) => onPaymentSubmit(transaction, id) } />
			);
	else return (
			<MobilePaymentError transaction={ paymentState.transaction } repeatPayment={ () => onRepeatPaymentClick() } error={ paymentState.error } />
			);
}

MobilePayment.propTypes = {
	paymentState: PropTypes.shape({
		stage: PropTypes.string.isRequired,
	}).isRequired,
	activeCardId: PropTypes.string,
	onPaymentSubmit: PropTypes.func.isRequired,
	onRepeatPaymentClick: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	paymentState: state.payments.mobilePayment,
	activeCardId: state.cards.activeCardId
});

const mapDispatchToProps = dispatch => ({
	/**
	   * Обработка успешного платежа
	   * @param {Object} transaction данные о транзакции
	   */
	onPaymentSubmit: (transaction, id) => dispatch(payMobile(transaction, id)),

	/**
	   * Повторить платеж
	   */
	onRepeatPaymentClick: () => dispatch(repeateMobileTransfer())
});

export default connect(mapStateToProps, mapDispatchToProps)(MobilePayment);
