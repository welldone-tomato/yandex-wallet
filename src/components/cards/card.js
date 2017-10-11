import React, { Component } from 'react';
import styled from 'emotion/react';
import Select from './select';

const CardLayout = styled.div`
position: relative;
width: 260px;
height: 164px;
box-sizing: border-box;
margin-bottom: 15px;
padding: 25px 20px 20px 25px;
border-radius: 4px;
background-color: ${({bgColor, active}) => active ? bgColor : 'rgba(255, 255, 255, 0.1)'};
cursor:pointer;
`;

const CardLogo = styled.div`
height: 28px;
margin-bottom: 25px;
background-image: url(${({url}) => url});
background-size: contain;
background-repeat: no-repeat;
filter: ${({active}) => active ? 'none' : 'grayscale(100%) opacity(60%)'};
`;

const CardNumber = styled.div`
margin-bottom: 20px;
color: ${({active, textColor}) => active ? textColor : 'rgba(255, 255, 255, 0.6)'};
font-size: 16px;
font-family: 'OCR A Std Regular';
`;

const CardType = styled.div`
height: 26px;
background-image: url(${({url}) => url});
background-size: contain;
background-repeat: no-repeat;
background-position-x: right;
opacity: ${({active}) => active ? '1' : '0.6'};
`;

const NewCardLayout = styled(CardLayout)`
background-color: transparent;
background-image: url('/assets/cards-add.svg');
background-repeat: no-repeat;
background-position: center;
box-sizing: border-box;
border: 2px dashed rgba(255, 255, 255, 0.2);
`;

const CardSelect = styled(Select)`
width: 100%;
margin-bottom: 15px;
`;

class Card extends Component {
	render() {
        const {data, active, type, onClick} = this.props;

        if (type === 'new')
            return (<NewCardLayout />);

        if (type === 'select') {
			const {activeCardIndex} = this.props;
			const selectedCard = data[activeCardIndex];
			const {bgColor, bankLogoUrl, brandLogoUrl} = selectedCard.theme;

			return (
				<CardLayout active={true} bgColor={bgColor}>
					<CardLogo url={bankLogoUrl} active={true} />
					<CardSelect value={selectedCard.number} onChange={id => this.props.onCardChange(id)}>
						{data.map((card, index) => (
							<Select.Option key={index} value={`${index}`}>{card.number}</Select.Option>
						))}
					</CardSelect>
					<CardType url={brandLogoUrl} active={true} />
				</CardLayout>
			);
		}

        const {number, theme} = data;
        const {bgColor, textColor, bankLogoUrl, brandLogoUrl} = theme;
        const themedBrandLogoUrl = active ? brandLogoUrl : brandLogoUrl.replace(/-colored.svg$/, '-white.svg');

        return (
			<CardLayout active={active} bgColor={bgColor} onClick={onClick} >
				<CardLogo url={bankLogoUrl} active={active} />
				<CardNumber textColor={textColor} active={active}>
					{number}
				</CardNumber>
				<CardType url={themedBrandLogoUrl} active={active} />
			</CardLayout>
		);
    }
}

export default Card;
