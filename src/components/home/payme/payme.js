import React, { Component } from 'react';
import { connect } from 'react-redux';

import PaymeContract from './payme_contract';
import { PaymeSuccess, PaymeError } from './payme_screens';

import { getMr } from '../../../actions/mrs';
import { getPreparedCards } from '../../../selectors/cards';


class Payme extends Component {
    //11316ba6-68c3-3322-900c-a3564b5d008f

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
        const {error, contract, isLoading} = this.props;
        const {isValidGUID} = this.state;

        if (isLoading) return ( <div>
                                  загрузка...
                                </div>)
        if (error) return ( <div>
                              ошибка...
                            </div>)
        if (isValidGUID)
            return (
                <div>
                  КОНТРАКТ
                </div>
                );
    }
}

const mapStateToProps = state => ({
    error: state.mrs.error,
    isLoading: state.mrs.error,
    contract: state.mrs.contract,
    cards: getPreparedCards()
});

const mapDispatchToProps = dispatch => ( {
    fetchMrs: guid => dispatch(getMr(guid))
})


export default connect(mapStateToProps, mapDispatchToProps)(Payme);
