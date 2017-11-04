import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import Button from '../misc/button';
import Input from '../misc/input';

const InputField = styled.div`
display: flex;
flex-direction: column;

margin-bottom: 26px;
margin-left: 5px;
position: relative;
padding-left: 10px;
`;

const Label = styled.div`
font-size: 15px;
color: #fff;
margin-bottom: 10px;
`;

const CustomInput = styled(Input)`
width: 225px;
`;

const CardPaymeLayout = styled.div`
	flex: 1;
	width: 260px;
`;

const Title = styled.div`
	font-size: 20px;
	font-weight: 500;
	letter-spacing: 0.9px;
	color: #ffffff;
	margin-bottom: 10px;
`;

const LinkCardText = styled.div`
	opacity: 0.4;
	font-size: 11px;
	line-height: 2.18;
	letter-spacing: 0.5px;
	color: #ffffff;
	margin-top: 4px;
`;

const Footer = styled.div`
	display: flex;
	justify-content: space-between;
	margin-top: 35px;
`;

const ErrorTitle = styled(Title)`
color: #6c0202;
font-size: 16px;
`;

const SuccessTitle = styled(Title)`
color: #0a6c02;
font-size: 12px;
`;

class CardAddPayme extends Component {
	constructor(props) {
		super(props);

		this.state = {
			sum: '100',
			goal: 'Ты должен мне денег'
		};

		this.handleSumChange = this.handleSumChange.bind(this);
		this.onCreateClick = this.onCreateClick.bind(this);
		this.handleGoalChange = this.handleGoalChange.bind(this);
	}

	onCreateClick(e) {
		const {sum, goal} = this.state;

		if (!sum || !goal) return;

		const isNumber = !isNaN(parseFloat(sum)) && isFinite(sum);
		if (!isNumber || sum <= 0) return;

		this.props.createPayMe(sum, goal);
	}

	handleSumChange(event) {
        this.setState({
            sum: event.target.value
        });
	}
	
	handleGoalChange(event)  {
        this.setState({
            goal: event.target.value
        });
	}

	render() {
		const {onCancelClick, error, createdLink} = this.props;

		if (!createdLink)
			return (
				<CardPaymeLayout>
					<Title>Запрос средств</Title>
					{error && <ErrorTitle>{error}</ErrorTitle>}
					<InputField>
						<Label>Сумма</Label>
						<CustomInput value={ this.state.sum } onChange={ this.handleSumChange } />
					</InputField>
					<InputField>
						<Label>Комментарий</Label>
						<CustomInput value={ this.state.goal } onChange={ this.handleGoalChange } />
					</InputField>
					<LinkCardText>Запрос средств можно удалить в любое время</LinkCardText>
					<Footer>
					<div onClick={ this.onCreateClick }>
						<Button bgColor='#d3292a' textColor='#fff'>Создать</Button>
					</div>
					<div onClick={ () => onCancelClick(true) }>
						<Button bgColor='#1F1F1F' textColor='#fff'>Вернуться</Button>
					</div>
					</Footer>
				</CardPaymeLayout>
				);
		
		return (
					<CardPaymeLayout>
						{createdLink &&
						<InputField>
							<Label>Ссылка на получение средств:</Label>
							<SuccessTitle>{createdLink}</SuccessTitle>
						</InputField>}
												
						<Footer>
						<div onClick={ () => onCancelClick(true) }>
							<Button bgColor='#1F1F1F' textColor='#fff'>Вернуться</Button>
						</div>
						</Footer>
					</CardPaymeLayout>
					);		
	}
}

CardAddPayme.propTypes = {
	onCancelClick: PropTypes.func.isRequired,
	createPayMe: PropTypes.func.isRequired,
	error: PropTypes.string,
	url:PropTypes.string
};

export default CardAddPayme;
