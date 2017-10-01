import React, { Component } from 'react';
import { connect } from 'react-redux';

import { fetchCards } from '../actions';

class Cards extends Component {
    componentDidMount() {
        this.props.fetchCards();
    }

    renderCard(cards) {
        const cardList = cards.map(card => {
            return (
                <div className="column">
                  <div className="card">
                    <header className="card-header">
                      <p className="card-header-title">
                        { card }
                      </p>
                      <a className="card-header-icon" aria-label="more options">
                        <span className="icon">
                                                                                                                                                                                                                                                                                                                                                                                                                <i className="fa fa-angle-down" aria-hidden="true"></i>
                                                                                                                                                                                                                                                                                                                                                                                                              </span>
                      </a>
                    </header>
                    <div className="card-content">
                      <div className="content">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                        <a>@bulmaio</a>. <a>#css</a> <a>#responsive</a>
                        <br/>
                        <time>11:09 PM - 1 Jan 2016</time>
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
