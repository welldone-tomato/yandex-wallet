import React, { Component } from 'react';
import { connect } from 'react-redux';

import PaymeContract from './payme_contract';
import { PaymeSuccess, PaymeError } from './payme_screens';

import { getMr } from '../../../actions/mrs';
import { getPreparedCards } from '../../../selectors/cards';
import { payCardToUser, repeateCard2User, clearCard2UserState } from '../../../actions/payments';
import { changeActiveCard } from '../../../actions/cards';

class Payme extends Component {
    validateGUID(guid) {
        return new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$').test(guid);
    }

    constructor(props) {
        super(props);

        this.state = {
            isValidGUID: false
        }
    }

    componentDidMount() {
        const guid = this.props.params.guid;

        if (this.validateGUID(guid)) {
            this.setState({
                isValidGUID: true
            });

            this.props.fetchMrs(guid);
        }
    }

    render() {
        const {loadingError, card2UserState, contract, isLoading, userName, cards, onPaymentSubmit, onRepeatPaymentClick, returnToTrans, onChangeActiveCard} = this.props;
        const {isValidGUID} = this.state;

        if (isLoading) return ( <div />);

        if (contract)
            if (userName === contract.userName)
                return (<PaymeError transaction={ { sum: contract ? contract.sum ? contract.sum : 0 : 0 } } error={ 'Вы не можете переводить деньги сами себе...' } repeatPayment={ () => onRepeatPaymentClick() } returnToTrans={ () => returnToTrans() } />);

        if (card2UserState.stage === 'success')
            return (<PaymeSuccess transaction={ card2UserState.transaction } repeatPayment={ () => onRepeatPaymentClick() } returnToTrans={ () => returnToTrans() } />);

        if (contract && card2UserState.stage === 'contract') return (<PaymeContract guid={ this.props.params.guid } contract={ contract } cardsList={ cards } onChangeActiveCard={ id => onChangeActiveCard(id) } onPaymentSubmit={ (transaction, id) => onPaymentSubmit(transaction, id) }
                                                                     />);
        if (card2UserState.error && card2UserState.stage === 'error') return (<PaymeError transaction={ card2UserState.transaction } error={ card2UserState.error } repeatPayment={ () => onRepeatPaymentClick() } returnToTrans={ () => returnToTrans() } />);

        if (!isValidGUID || loadingError)
            return (<PaymeError transaction={ { sum: contract ? contract.sum ? contract.sum : 0 : 0 } } error={ !isValidGUID ? 'Неверная ссылка' : loadingError ? loadingError : 'Что то случилось...' } repeatPayment={ () => onRepeatPaymentClick() } returnToTrans={ () => returnToTrans() } />);

        return (<div />);
    }
}

const mapStateToProps = state => ({
    loadingError: state.mrs.loadingError,
    card2UserState: state.payments.card2User,
    isLoading: state.mrs.isLoading,
    contract: state.mrs.contract,
    cards: getPreparedCards(state),
    userName: state.auth.userName
});

const mapDispatchToProps = dispatch => ( {
    fetchMrs: guid => dispatch(getMr(guid)),
    /**
	   * Обработка успешного платежа
	   * @param {Object} transaction данные о транзакции
	   */
    onPaymentSubmit: (transaction, id) => dispatch(payCardToUser(transaction, id)),
    /**
	   * Повторить платеж
	   */
    onRepeatPaymentClick: () => dispatch(repeateCard2User()),

    returnToTrans: () => dispatch(clearCard2UserState()),

    onChangeActiveCard: (id) => dispatch(changeActiveCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Payme);
