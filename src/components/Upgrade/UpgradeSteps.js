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
	let currStep = props.match.params.step;
	let btnPrevious = () => props.history.push('/upgrade/location');
	let btnNext;
	let btnToolTips = {};
	switch (currStep){
		case 'backup':
		//create the function to be called when the next button is pressed
			btnNext = () => {
				props.onCreateUpgradeBackup(props.productionFolder, props.backupFolder)
					.then((response) => {
						console.log('pushing /upgrade/copyfiles/');
						props.history.push('/upgrade/copyfiles');
					});
			};
			//Add a tool tip for the next Button
			btnToolTips.nextToolTip = 'Create Backup'
			break;
		case 'copyfiles':
			btnNext = () => {
				props.onUpgradeAnalytixFiles(props.productionFolder, props.backupFolder)
					.then((response) => {
						console.log('pushing /upgrade/mergefiles/');
						props.history.push('/upgrade/mergefiles');
					});
			};
			btnToolTips.nextToolTip = 'Copy Upgrade Files'
			break;
		default:
			btnNext = () => alert('ERROR');
	}

	return (
		<Wrapper>
			<h1 style={{textAlign: "center"}}>Press Next to continue with Upgrade</h1>
			<Step.Group ordered>
				{/*STEP 1 - Create Backup*/}
				<Step
					completed={currStep !== 'backup'}
					active={currStep === 'backup'}
				>
					<Step.Content>
						<Step.Title>Backup</Step.Title>
						<Step.Description>Backup Production files</Step.Description>
						{props.status === 'working' && currStep === 'backup' && <Button
							loading
							disabled
							content="Backing up Production Files"
						/>}
					</Step.Content>
				</Step>
				{/*STEP 2 - Copy Upgrade Files*/}
				<Step
					completed={currStep !== 'copyfiles' && currStep !=='backup'}
					active={currStep === 'copyfiles'}
				>
					<Step.Title>Copy New Files</Step.Title>
					<Step.Description>Copy new Analytix files production</Step.Description>
					{props.status === 'working' && currStep === 'copyfiles' && <Button
						loading
						disabled
						content="Copying Upgrade Files"
					/>}
				</Step>
				{/*STEP 3 - Merge Variable File*/}
				<Step
					completed={currStep !== 'copyfiles' && currStep !=='backup' && currStep !== 'mergefiles'}
					active={currStep === 'mergefiles'}
				>
					<Step.Title>Merge Variables File</Step.Title>
					<Step.Description>Merge Upgrade and Production Variables files</Step.Description>
					{props.status === 'working' && currStep === 'mergefiles' && <Button
						loading
						disabled
						content="Merging Variable and Group Files"
					/>}
				</Step>
			</Step.Group>
			<br />
			<ProgressButtons
				onPreviousClick={btnPrevious}
				onNextClick={btnNext}
				btnToolTips={btnToolTips}
			/>
		</Wrapper>
	);
};

UpgradeCreateBackup.propTypes = {
	onCreateUpgradeBackup: PropTypes.func
}
export default UpgradeCreateBackup;
