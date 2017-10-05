import React, { Component } from 'react';
import PropTypes from 'prop-types';

import MobilePaymentContract from './mobile_payment_contract';
import MobilePaymentSuccess from './mobile_payment_success';
import MobilePaymentError from './mobile_payment_error';

/**
 * Класс компонента MobilePayment
 */
class MobilePayment extends Component {
	/**
	 * Рендер компонента
	 *
	 * @override
	 * @returns {JSX}
	 */
	render() {
		const {activeCard, mobilePaymentState} = this.props;

		if (mobilePaymentState.stage === 'success')
			return (
				<MobilePaymentSuccess transaction={ mobilePaymentState.transaction } repeatPayment={ () => this.props.onRepeatPaymentClick() } />
				);
		else if (mobilePaymentState.stage === 'contract')
			return (
				<MobilePaymentContract activeCard={ activeCard } onPaymentSuccess={ (transaction, id) => this.props.onMobilePaymentClick(transaction, id) } />
				);
		else return (
				<MobilePaymentError transaction={ mobilePaymentState.transaction } repeatPayment={ () => this.props.onRepeatPaymentClick() } error={ mobilePaymentState.error } />
				);
	}
}

MobilePayment.propTypes = {
	activeCard: PropTypes.shape({
		id: PropTypes.number,
		theme: PropTypes.object
	}),
	mobilePaymentState: PropTypes.shape({
		stage: PropTypes.string.isRequired,
	}).isRequired,
	onMobilePaymentClick: PropTypes.func.isRequired,
	onRepeatPaymentClick: PropTypes.func.isRequired
};

export default MobilePayment;
