import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { signOutUser } from '../../actions';

import logo from './ya-money-logo.png';

class Nav extends Component {
  renderLoginLink = () => {
    if (this.props.isAuth) return <a onClick={ this.props.signOutUser } className="navbar-item is-tab">Выйти</a>
    else return <Link to="/signin" className="navbar-item is-tab">Войти</Link>
  };

  render = () => {
    return (
      <div className="container">
        <nav className="navbar">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">
            <img src={ logo } alt="" width="112" height="28" />
            </Link>
            <button className="button navbar-burger">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
          <div className="navbar-end">
            <Link to="/cards" className="navbar-item is-tab" activeClassName="is-active">Карты</Link>
            <Link to="/transactions" className="navbar-item is-tab" activeClassName="is-active">Транзакции</Link>
            { this.renderLoginLink() }
          </div>
        </nav>
      </div>
      );
  }
}

const mapStateToProps = state => ({
  isAuth: state.auth.isAuth
});

export default connect(mapStateToProps, {
  signOutUser
})(Nav);
