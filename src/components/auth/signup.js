import React, { Component } from 'react';

import { connect } from 'react-redux'
import { signUpUser } from '../../actions/auth';
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

const InputEmail = styled(Input)`
width: 225px;
`;

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'admin@admin.net',
            password: 'adminAmdin2017&',
            passwordCheck: 'adminAmdin2017&',
            error: null
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);        
        this.handlePasswordCheckChange = this.handlePasswordCheckChange.bind(this); 
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

    handlePasswordCheckChange = event => {
        this.setState({
            passwordCheck: event.target.value
        });
    }

    handleClick = () => {
        const {email, password, passwordCheck} = this.state;
        
        if (password !== passwordCheck) return this.setState({error:'Пароли не совпадают'});

        if (email && password) {
            this
                .props
                .dispatch(signUpUser({
                    email,
                    password
                }));
        }
        else this.setState({error:'Не все поля заполнены'});
    }

    render() {
        const error = this.props.error? this.props.error : this.state.error? this.state.error : null;

        return (
            <LoginLayout>
                <LoginTitle>Регистрация в аккаунт</LoginTitle>
                { error && <ErrorTitle>{error}</ErrorTitle>}
                <InputField>
					<Label>Email</Label>
					<InputEmail type="email" value={ this.state.email } onChange={this.handleEmailChange } placeholder="jsmith@example.org"/>
				</InputField>
                <InputField>
					<Label>Пароль</Label>
					<InputEmail type="password" value={ this.state.password } onChange={this.handlePasswordChange } placeholder="●●●●●●●"/>
				</InputField>
                <InputField>
					<Label>Пароль еще раз</Label>
					<InputEmail type="password" value={ this.state.passwordCheck } onChange={this.handlePasswordCheckChange } placeholder="●●●●●●●"/>
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

export default connect(mapStateToProps)(SignUp)
