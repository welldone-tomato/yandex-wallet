import React, { Component } from 'react';

import { connect } from 'react-redux'
import { signInUser } from '../../actions/auth';

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleEmailChange = event => {
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChange = event => {
        this.setState({
            password: event.target.value
        });
    }

    handleClick = () => {
        const {email, password} = this.state;
        if (email && password) {
            this
                .props
                .dispatch(signInUser({
                    email,
                    password
                }));
        }
    }

    render() {
        return (
            <section className="hero is-fullheight is-dark is-bold">
              <div className="hero-body">
                <div className="container">
                  <div className="columns is-vcentered">
                    <div className="column is-4 is-offset-4">
                      <h1 className="title">Войти в аккаунт</h1>
                      <div className="box">
                        <label className="label">Email</label>
                        <p className="control">
                          <input className="input" type="email" name="email" value={ this.state.email } onChange={ this.handleEmailChange } placeholder="jsmith@example.org" />
                        </p>
                        <label className="label">Password</label>
                        <p className="control">
                          <input className="input" type="password" name="password" value={ this.state.password } onChange={ this.handlePasswordChange } placeholder="●●●●●●●" />
                        </p>
                        <hr/>
                        <p className="control">
                          <button className="button is-primary" onClick={ this.handleClick }>Войти</button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            );
    }
}

export default connect()(SignIn)
