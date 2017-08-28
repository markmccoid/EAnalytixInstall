import React from 'react';
import PropTypes from 'prop-types';
import styled  from 'styled-components';
import { Button } from 'semantic-ui-react'
import { Step } from 'semantic-ui-react'

import { Header } from './CommonStyled';
import ProgressButtons from './ProgressButtons';

const InstallTypeWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	margin: 10px;
`;

const InstallTypeSelect = props => {
	let btnPrevious = () => props.history.push('/');
	let btnNext = () => props.history.push(`/${props.type}/location`);
	return (
		<InstallTypeWrapper>
				<Header textAlign="center">Select "Install" to install Analytix or "Upgrade" <br />
					to upgrade an existing installation of Analytix <br />
					then click "Next"
				</Header>
				<Button.Group>
					<Button toggle active={props.type==='install'}
						onClick={()=> props.onChangeInstallType('install')}>Install</Button>
					<Button.Or />
					<Button toggle active={props.type==='upgrade'}
						onClick={()=> props.onChangeInstallType('upgrade')}>Upgrade</Button>
				</Button.Group>
				<br />
				<ProgressButtons onPreviousClick={btnPrevious} onNextClick={btnNext} prevBtnDisabled />
			</InstallTypeWrapper>
	);
};

InstallTypeSelect.propTypes = {
	onChangeInstallType: PropTypes.func,
	productionFolder: PropTypes.string,
	backupFolder: PropTypes.string,
	type: PropTypes.string, //'install' or 'upgrade'
	status:  PropTypes.string, // or 'working' set status to working when installing or upgrading, 'finished' = success
	statusMessage:  PropTypes.string,
	currentStep:  PropTypes.number
}

export default InstallTypeSelect;
