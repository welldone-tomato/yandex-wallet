import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { signOutUser } from '../actions';

class Nav extends Component {
  renderLoginLink() {
    if (this.props.isAuth)
      return <a onClick={ this.props.signOutUser } className="nav-item is-tab">Выйти</a>

    else
      return <Link to="/signin" className="nav-item is-tab">Войти</Link>
  }

  render() {
    const st = {
      marginBottom: '20px'
    };

    return (
      <nav className="nav" style={ st }>
        <div className="nav-left">
          <div className="nav-item">
            <p className="subtitle is-5">
              <Link to="/"><strong>Yandex</strong> кошелек</Link>
            </p>
          </div>
          <a className="nav-item"> <i className="fa fa-github"></i></a>
        </div>
        <div className="nav-right nav-menu">
          <Link to="/cards" className="nav-item is-tab" activeClassName="is-active">Карты</Link>
          <Link to="/transactions" className="nav-item is-tab" activeClassName="is-active">Транзакции</Link>
          { this.renderLoginLink() }
        </div>
      </nav>
      );
  }
}

export default connect(state => ({
  isAuth: state.auth.isAuth
}), {
  signOutUser
})(Nav);
