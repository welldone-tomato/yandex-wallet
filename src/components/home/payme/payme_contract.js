import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

import Island from '../../misc/island';
import Title from '../../misc/title';
import Button from '../../misc/button';
import Input from '../../misc/input';

const PaymeLayout = styled(Island)`
	margin: 15px;
	min-width: 350px;
	display: flex;
	flex-direction: column;
	align-items: center;
	background-color: rgba(158, 158, 158, 0.26);
	box-sizing: border-box;
`;

const PrepaidTitle = styled(Title)`
	color: #000;
`;

const PrepaidItems = styled.div`
	width: 456px;
	margin-bottom: 40px;
	background-color: #3a3a3a;
	border-radius: 4px;
	min-width: 247px;
`;

const PrepaidItem = styled.div`
	height: 65px;
	display: flex;
	align-items: center;
	border-radius: 3px;
	cursor: pointer;
	background-color: ${({selected, bgColor}) => selected ? bgColor : 'rgba(0, 0, 0, 0.05)'};
`;

const PrepaidItemIcon = styled.div`
	width: 42px;
	height: 42px;
	margin: 18px;
	border-radius: 21px;
	background-image: url(${({bankSmLogoUrl}) => bankSmLogoUrl});
	background-size: contain;
	background-repeat: no-repeat;
	filter: ${({selected}) => selected ? 'none' : 'grayscale(100%)'};
`;

const PrepaidItemTitle = styled.div`
	font-size: 13px;
	color: ${({selected, textColor}) => selected ? textColor : 'rgba(255, 255, 255, 0.6)'};
`;

const PrepaidItemDescription = styled.div`
	color: ${({selected, textColor}) => selected ? textColor : 'rgba(255, 255, 255, 0.4)'};
`;

const InputField = styled.div`
	margin: 20px 0;
	position: relative;
`;

const SumInput = styled(Input)`
	max-width: 200px;
	padding-right: 20px;
	background-color: rgba(0, 0, 0, 0.08);
	color: #fff;
`;

const Currency = styled.span`
	font-size: 12px;
	position: absolute;
	right: 10;
	top: 8px;
	color: #fff;
`;

const Row = styled.div`
	display: flex;
`;

const DetailLabel = styled.div`
	display: flex; 
	flex-direction: column;
	font-size: large;
	padding-right: 10px;
	word-wrap: normal;
`;

const UserSpan = styled.span`
	text-decoration: underline;
	color: blue;
`;

const SumSpan = styled.span`
	font-weight: bold;
	font-size: x-large;
`;

/**
 * Класс компонента PaymeContract
 */
class PaymeContract extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента PrepaidContract
	 */
	constructor(props) {
		super(props);

		this.state = {
			activeCardIndex: 0,
			sum: Number(this.props.contract.sum)
		};
	}

	/**
	 * Изменения активной карты
	 * @param {Number} activeCardIndex индекс активной карты
	 */
	onCardChange(activeCardIndex) {
		this.setState({activeCardIndex});

		const fromCard = this.props.cardsList[activeCardIndex];

		this.props.onChangeActiveCard(fromCard.id);
	}

	/**
	 * Обработка изменения значения в input
	 * @param {Event} event событие изменения значения input
	 */
	onChangeInputValue(event) {
		if (!event) {
			return;
		}

		const {name, value} = event.target;

		this.setState({
			[name]: value
		});
	}

	/**
	 * Отправка формы
	 * @param {Event} event событие отправки формы
	 */
	onClick(event) {
		if (event) {
			event.preventDefault();
		}

		const {sum} = this.state;
		const {guid, contract} = this.props;

		const isNumber = !isNaN(parseFloat(sum)) && isFinite(sum);
		if (!isNumber || sum <= 0) return;

		const fromCard = this.props.cardsList[this.state.activeCardIndex];
			
		this.props.onPaymentSubmit({
			sum,
			guid: guid,
			userName:contract.userName
		}, fromCard.id);
	}

	render() {
		const {cardsList, contract} = this.props;

		if (cardsList.length === 0) return (<div></div>);

		const {activeCardIndex} = this.state;
		const selectedCard = cardsList[activeCardIndex];

		return (
				<PaymeLayout>
					<PrepaidTitle>Исходящий платеж</PrepaidTitle>
					<Row>
						<DetailLabel>
							<div style={{"margin-bottom": "20px" }}>Пользователь <UserSpan>{contract.userName}</UserSpan> просит вас перевести деньги {contract.sum && <span> в размере <SumSpan>{contract.sum}</SumSpan> р. </span>} 
							на карту <SumSpan>{contract.cardNumber}</SumSpan></div>
							<div>Комментарий к платежу: <span>{contract.goal}</span></div>
						</DetailLabel>
						<PrepaidItems>
							{
								cardsList.map((card, index) => (
									<PrepaidItem
										bgColor={card.theme.bgColor}
										key={card.id}
										onClick={() => this.onCardChange(index)}
										selected={activeCardIndex === index}>
										<PrepaidItemIcon
											bankSmLogoUrl={card.theme.bankSmLogoUrl}
											selected={activeCardIndex === index} />
										<PrepaidItemTitle
											textColor={card.theme.textColor}
											selected={activeCardIndex === index}>
											C банковской карты
											<PrepaidItemDescription
												textColor={card.theme.textColor}
												selected={activeCardIndex === index}>
												{card.number}
											</PrepaidItemDescription>
										</PrepaidItemTitle>
									</PrepaidItem>
								))
							}
						</PrepaidItems>
					</Row>

					<InputField>
						<SumInput
							name='sum'
							value={this.state.sum}
							onChange={(event) => this.onChangeInputValue(event)} />
						<Currency>₽</Currency>
					</InputField>
					<Button
						type='submit'
						bgColor={selectedCard.theme.bgColor}
						textColor={selectedCard.theme.textColor}
						onClick={(event) => this.onClick(event)}>
						Перевести
					</Button>
				</PaymeLayout>
		);
	}
}

PaymeContract.propTypes = {
	cardsList: PropTypes.arrayOf(PropTypes.object),
	onPaymentSubmit: PropTypes.func.isRequired
};

export default PaymeContract;
