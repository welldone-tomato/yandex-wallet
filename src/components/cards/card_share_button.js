import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';

const CardShareIcon = styled.div`
	width: 24px;
	height: 24px;
	position: absolute;
	top: -12px;
	right: 20px;
	background-image: url('/assets/cards-share-active.png');
	background-repeat: round;
	cursor: pointer;
	display: ${({shareable}) => (shareable ? 'block' : 'none')};
`;

const CardShareButton = ({shareable, onClick, id}) => (
	<CardShareIcon shareable={ shareable } onClick={ event => onClick(event, id) } />
);

CardShareButton.propTypes = {
	shareable: PropTypes.bool,
	onClick: PropTypes.func,
	id: PropTypes.string
};

export default CardShareButton;
