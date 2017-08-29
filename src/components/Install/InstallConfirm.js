import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Icon } from 'semantic-ui-react';
import { Header } from '../CommonStyled';
const { remote } = require('electron');

import ProgressButtons from '../ProgressButtons';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	margin: 10px;
`;

const InstallConfirm = props => {
	let btnPrevious = () => props.history.push(`/install/location`);
	let btnNext = () => null;
	let buttonOptions;
	let customBtnOptions;
	let header = 'Press Install to Install Analytix';
	switch (props.status) {
		case 'working':
			buttonOptions = { loading: true, disabled: true, content: "Analytix Being Installed" };
			header = 'Analytix is being installed, please wait...';
			break;
		case 'finished':
			buttonOptions = { disabled: true, content: "Analytix Installed" };
			customBtnOptions = {content: "Exit", positive: true}
			header = 'Analytix has installed successfully, you may exit the installer.'
			break;
		case 'error':
			buttonOptions = { disabled: true, content: "ERROR" };
			customBtnOptions = {content: "Exit", color: "red"}
			header = 'ERROR installing Analytix, please contact NCS support';
			break;
		default:
			buttonOptions = { icon: 'computer', content: "Install Analytix"};
	}

	return (
		<Wrapper>
			<Header>{header}</Header>
			<Button positive
				{...buttonOptions}
			 	onClick={props.onInstallAnalytix}
			/>
			<br />
				<ProgressButtons
					onPreviousClick={btnPrevious}
					onNextClick={btnNext}
					nextBtnDisabled
					showCustomBtn={props.status === 'finished' || props.status === 'error'}
					customBtnProperties={customBtnOptions}
					onCustomBtnClick={() => remote.app.quit()}
				/>


		</Wrapper>
	)
};

InstallConfirm.propTypes = {
	status: PropTypes.string,
	onInstallAnalytix: PropTypes.func
}

export default InstallConfirm;

//
// {props.status === 'finished'
// 	? <Button primary onClick={() => remote.app.quit()}>Exit</Button>
// 	: <ProgressButtons onPreviousClick={btnPrevious} onNextClick={btnNext} nextBtnDisabled />
// }
