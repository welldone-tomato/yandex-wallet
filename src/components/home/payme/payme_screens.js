import React from 'react';
import styled from 'emotion/react';
import PropTypes from 'prop-types';

import Island from '../../misc/island';
import Title from '../../misc/title';

const PrepaidLayout = styled(Island)`
	margin: 50px auto;
	width: 350px;
	display: flex;
	flex-direction: column;
	background-color: #477633;
	position: relative;
	color: #fff;
	box-sizing: border-box;
`;

const PrepaidLayoutError = styled(Island)`
	margin: 50px auto;	
	width: 350px;
	display: flex;
	flex-direction: column;
	background-color: #7f0d00;
	position: relative;
	color: #fff;
	box-sizing: border-box;
`;

const CheckIcom = styled.div`
	width: 48px;
	height: 48px;
	background-image: url(/assets/round-check.svg);
	position: absolute;
	top: 14;
	right: 20;
`;

const Header = styled(Title)`
	color: #fff;
`;

const SectionGroup = styled.div`
	margin-bottom: 20px;
`;

const Section = styled.div`
	margin-bottom: 20px;
	width: 100%;
`;

const SectionLabel = styled.div`
	font-size: 13px;
	text-align: left;
`;

const SectionValue = styled.div`
	font-size: 13px;
	letter-spacing: 0.6px;
`;

const RepeatPayment = styled.button`
	font-size: 13px;
	background-color: rgba(0, 0, 0, 0.08);
	height: 42px;
	display: flex;
	justify-content: center;
	align-items: center;
	border: none;
	width: 100%;
	margin-bottom: 10px;
	cursor: pointer;
	text-transform: uppercase;
`;

export const PaymeSuccess = ({transaction, repeatPayment, returnToTrans}) => {
	const {sum} = transaction;

	return (
		<PrepaidLayout>
			<CheckIcom />
			<SectionGroup>
				<Header>Перевод выполнен</Header>
				<Section>
					<SectionLabel>Сумма:</SectionLabel>
					<SectionValue>{sum} ₽</SectionValue>
				</Section>
			</SectionGroup>
			<RepeatPayment onClick={repeatPayment}>Отправить еще раз</RepeatPayment>
			<RepeatPayment onClick={returnToTrans}>Возвратиться к транзакциям</RepeatPayment>
		</PrepaidLayout>
	);
};

PaymeSuccess.propTypes = {
	transaction: PropTypes.shape({
		sum: PropTypes.string,
		number: PropTypes.string
	}).isRequired,
	repeatPayment: PropTypes.func.isRequired
};

export const PaymeError = ({transaction, repeatPayment, error, returnToTrans}) => {
	const {sum} = transaction;

	return (
		<PrepaidLayoutError>
			<CheckIcom />
			<SectionGroup>
				<Header>Ошибка</Header>
				<Section>
					<SectionLabel>Сумма:</SectionLabel>
					<SectionValue>{sum} ₽</SectionValue>
				</Section>
				<Section>
					<SectionLabel>Ошибка:</SectionLabel>
					<SectionValue>{error}</SectionValue>
				</Section>
			</SectionGroup>
			<RepeatPayment onClick={repeatPayment}>Попробовать еще раз</RepeatPayment>
			<RepeatPayment onClick={returnToTrans}>Возвратиться к транзакциям</RepeatPayment>
		</PrepaidLayoutError>
	);
};

PaymeError.propTypes = {
	transaction: PropTypes.shape({
		sum: PropTypes.string,
		number: PropTypes.string
	}).isRequired,
	repeatPayment: PropTypes.func.isRequired,
	error:PropTypes.string.isRequired
};
