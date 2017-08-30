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
	let { currStep } = props;
	let btnPrevious = () => props.history.push('/upgrade/location');
	let btnNext;

	switch (currStep){
		case 'backup':
			btnNext = () => {
				props.onCreateUpgradeBackup(props.productionFolder, props.backupFolder)
					.then((response) => {
						console.log('pusing /upgrade/copyfiles/');
						props.history.push('/upgrade/copyfiles');
					});
			};
			break;
		case 'copyfiles':
			btnNext = () => {
				props.onUpgradeAnalytixFiles(props.productionFolder, props.backupFolder)
					.then((response) => {
						console.log('pusing /upgrade/mergefiles/');
						props.history.push('/upgrade/mergefiles');
					});
			};
			break;
		default:
			btnNext = () => alert('ERROR');
	}
console.log(finishedObj.backupFinished);
	return (
		<Wrapper>
			<h1>Press Next to continue with Upgrade</h1>
			<Step.Group ordered>
				<Step
					completed={finishedObj.backupFinished}
					active={currStep === 'backup'}
				>
					<Step.Content>
						<Step.Title>Backup</Step.Title>
						<Step.Description>Backup Production files</Step.Description>
						{props.status === 'working' && <Button
							loading
							disabled
							content="Backing up Production Files"
						/>}
					</Step.Content>
				</Step>

				<Step
					completed={finishedObj.copyFinished}
					active={currStep === 'copyfiles'}
				>
					<Step.Title>Copy New Files</Step.Title>
					<Step.Description>Copy new Analytix files production</Step.Description>
				</Step>

				<Step title='Merge Variables File' description='Merge Variables files' />
			</Step.Group>
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
