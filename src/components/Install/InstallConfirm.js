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

const InstallConfirm = props => {
	let buttonOptions;
	switch (props.status) {
		case 'working':
			buttonOptions = { loading: true, disabled: true, content: "Analytix Being Installed" };
			break;
		case 'finished':
			buttonOptions = { disabled: true, content: "Analytix Installed" };
			break;
		case 'error':
			buttonOptions = { disabled: true, content: "ERROR" };
			break;
		default:
			buttonOptions = { icon: 'computer', content: "Install Analytix"};
	}

	return (
		<Wrapper>
			<Header>Press Install to Install Analytix</Header>
			<Button positive
				{...buttonOptions}
			 	onClick={props.onInstallAnalytix}
			/>

		</Wrapper>
	)
};

InstallConfirm.propTypes = {
	status: PropTypes.string,
	onInstallAnalytix: PropTypes.func
}

export default InstallConfirm;
