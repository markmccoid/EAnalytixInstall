import React from 'react';
import PropTypes from 'prop-types';
import styled  from 'styled-components';
import { Button, Step, Message } from 'semantic-ui-react';

import ProgressButtons from '../ProgressButtons';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	margin: 10px;
`;

const UpgradeCreateBackup = props => {
	let btnPrevious = () => props.history.push('/upgrade/location');
	let btnNext = () => console.log('push to next route');
	return (
		<Wrapper>
			<h1>Press Next to continue with Upgrade</h1>
			<Step.Group ordered>
				<Step active>
					<Step.Content>
						<Step.Title>Backup</Step.Title>
						<Step.Description>Backup Production files}</Step.Description>
					</Step.Content>
				</Step>

				<Step title='Copy New Files' description='Copy new Analytix files production.' />

				<Step title='Merge Variables File' description='Merge Variables files' />
			</Step.Group>
			<Button primary onClick={() => props.onCreateUpgradeBackup(props.productionFolder, props.backupFolder)}>Test Backup</Button>
			<br />
			<ProgressButtons
				onPreviousClick={btnPrevious}
				onNextClick={btnNext}
			/>
		</Wrapper>
	);
};

UpgradeCreateBackup.propTypes = {
	onCreateUpgradeBackup: PropTypes.func
}
export default UpgradeCreateBackup;
