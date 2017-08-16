import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Icon } from 'semantic-ui-react';
import { Header } from '../CommonStyled';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	margin: 10px;
`;

const InstallProgress = props => {
	return (
	    <Progress percent={85} color='blue' />
	);
};

export default InstallProgress;
