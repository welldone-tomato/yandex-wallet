import React from 'react';
import styled from 'emotion/react';
import { Link } from 'react-router';

const DropDown = styled.div`
	display: none;
	position: absolute;
	background-color: #f9f9f9;
	min-width: 160px;
	box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
	z-index: 1;

	& a {
		color: black;
		padding: 12px 16px;
		text-decoration: none;
		display: block;
	}

	& a:hover {background-color: #f1f1f1}
`;

const User = styled.div`
	display: flex;
	align-items: center;
	font-size: 15px;
	color: #000;
	cursor: pointer;
	&:hover {${DropDown} {display: block;}}
`;

const Avatar = styled.img`
	width: 42px;
	height: 42px;
	border-radius: 50%;
	margin-right: 10px;
`;

export default ({isAuth, userName, onSignOutClick}) => {
	if (isAuth) return (
			<User>
     <Avatar src="/assets/avatar.png" />
     { userName }
     <DropDown>
       <a onClick={ onSignOutClick }>Выйти</a>
     </DropDown>
   </User>)
	else return (
			<User>
     <Avatar src="/assets/avatar.png" />
     <Link to="singin">Войти</Link>
     <Link to="singup">Зарегистрироваться</Link>
   </User>);
};
