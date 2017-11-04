import React, { Component } from 'react';

import { connect } from 'react-redux'
import { signInUser } from '../../actions/auth';
import styled from 'emotion/react';
import Island from '../misc/island';
import Title from '../misc/title';
import Button from '../misc/button';
import Input from '../misc/input';

const LoginLayout = styled(Island)`
display: flex;
flex-direction: column;
align-items: center;
box-sizing: border-box;
width: 440px;
background: #3f51b5;
margin: 100px auto;
`;

const LoginTitle = styled(Title)`
color: #fff;
`;

const ErrorTitle = styled(Title)`
color: #6c0202;
font-size: 16px;
`;

const InputField = styled.div`
display: flex;
align-items: center;
margin-bottom: 26px;
position: relative;
padding-left: 150px;
`;

const Label = styled.div`
font-size: 15px;
color: #fff;
position: absolute;
left: 0;
`;

const Underline = styled.div`
height: 1px;
margin-bottom: 20px;
background-color: rgba(0, 0, 0, 0.16);
`;

const LoginButton = styled(Button)`
float: right;
`;

const CustomInput = styled(Input)`
width: 225px;
`;

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'admin@admin.net',
            password: 'adminAmdin2017&'
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);        
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
            <LoginLayout>
                <LoginTitle>Войти в аккаунт</LoginTitle>
                {this.props.error && <ErrorTitle>{this.props.error}</ErrorTitle>}
                <InputField>
					<Label>Email</Label>
					<CustomInput type="email" value={ this.state.email } onChange={this.handleEmailChange } placeholder="jsmith@example.org"/>
				</InputField>
                <InputField>
					<Label>Пароль</Label>
					<CustomInput type="password" value={ this.state.password } onChange={this.handlePasswordChange } placeholder="●●●●●●●"/>
				</InputField>
                <Underline />
				<LoginButton bgColor='#fff' textColor='#108051' onClick={this.handleClick}>Войти</LoginButton>
            </LoginLayout>
            );
    }
}

const mapStateToProps = state =>({
    error: state.auth.error
});

export default connect(mapStateToProps)(SignIn)
