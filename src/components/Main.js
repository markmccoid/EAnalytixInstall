import React from 'react';
import styled  from 'styled-components';
import { Button } from 'semantic-ui-react'
import { Step } from 'semantic-ui-react'

const nativeFileAccess = window.require('../app/nativeFileAccess');

import Settings from './Settings/Settings';
import ProgressButtons from './ProgressButtons';
import StateDisplay from './StateDisplay';
import InstallConfirm from './Install/InstallConfirm';
import { Header } from './CommonStyled';

const Wrapper = styled.div`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 900px;
`;
const ButtonWrapper = styled.div`
	display: flex;
	justify-content: space-around;
`
const InstallTypeWrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	margin: 10px;
`;


class Main extends React.Component {
	state = {
		productionFolder: '',
		backupFolder: '',
		type: 'install', //or 'upgrade'
		status: undefined, // or 'working' set status to working when installing or upgrading.
		currentStep: 1
	}
	//------My functions
	//--Update the productionFolder state value
	storeProductionFolder = folderSelected => {
		this.setState(prevState => {
			//If previous state of backupFolder not populated, then guess otherwise leave alone
			let newBackupFolder = !prevState.backupFolder ?
														nativeFileAccess.guessBackupDir(folderSelected) :
														prevState.backupFolder;
			return ({
				productionFolder: folderSelected,
				backupFolder: newBackupFolder
			});
		});
	}
	//--Update the backupFolder state value
	storeBackupFolder = folderSelected => {
		this.setState({
				backupFolder: folderSelected
			});
		}
	//--Update the currentStep state value
	updateCurrentStep = newStep => {
		this.setState({currentStep: newStep});
	}
	installAnalytix = () => {
		this.setState({status: 'working'});
		nativeFileAccess.installAnalytix(this.state.productionFolder)
			.then(installStatus => {
				console.log(installStatus);
				this.setState({status: installStatus});
			});
	}
	//------------------
	render() {
		let currentStep = this.state.currentStep;
		let JSXStep;
		//--------------------------------------------
		//---Setup selection of install type (Step1)
		const installType = <InstallTypeWrapper>
				<Header textAlign="center">Select "Install" to install Analytix or "Upgrade" <br />
					to upgrade an existing installation of Analytix <br />
					then click "Next"
				</Header>
				<Button.Group>
					<Button toggle active={this.state.type==='install'}
						onClick={()=> this.setState({type: 'install'})}>Install</Button>
					<Button.Or />
					<Button toggle active={this.state.type==='upgrade'}
						onClick={()=> this.setState({type: 'upgrade'})}>Upgrade</Button>
				</Button.Group>
			</InstallTypeWrapper>;
		//--------------------------------------------
		//---Setup folderSelection (Step2)
		const folderSelection = <Settings
				{...this.state}
				onStoreProductionFolder={this.storeProductionFolder}
				onStoreBackupFolder={this.storeBackupFolder}
			/>;
		//
		const installFinal = <InstallConfirm status={this.state.status} onInstallAnalytix={this.installAnalytix}/>;
		//-----------------------------------------------
		//--Determine what to show based on state.currentStep concated with the state type
		//--will be 1i/1u, etc
		switch (currentStep + this.state.type[0] || '') {
			case '1i':
			case '1u':
				JSXStep = installType;
				break;
			case '2i':
			case '2u':
				JSXStep = folderSelection;
				break;
			case '3i':
				JSXStep = installFinal;
				break;
			case '3u':
				JSXStep = upgradeNext;
				break;
			default:
				JSXStep = null;
		};
console.log(currentStep + this.state.type[0] || '')
		return (
			<Wrapper>
				{JSXStep}
				<ProgressButtons currentStep={currentStep} type={this.state.type} onUpdateCurrentStep={this.updateCurrentStep} />
				<StateDisplay {...this.state} />
			</Wrapper>
		);
	}
}

export default Main;

/* ---Steps semantic ui code

const steps = [
  { completed: true, title: 'Backup Production', description: 'Backup Production Directory' },
  { completed: true, title: 'Update Production', description: 'Copy new files to production directory' },
  { active: true, title: 'Clean up', description: 'Clean up after ourselves' },
]

//-------------------
//--JSX
<div>
	<Step.Group ordered>
		<Step completed onClick={()=>console.log('clicked shipping')}>
			<Step.Content>
				<Step.Title>Shipping</Step.Title>
				<Step.Description>Choose your shipping options
					<Button primary size="mini">
						Click Here
					</Button>
				</Step.Description>

			</Step.Content>
		</Step>

		<Step completed title='Billing' description='Enter billing information' />

		<Step active title='Confirm Order' description='Verify order details' />
	</Step.Group>

	<br />

	<Step.Group ordered items={steps} />
</div>
*/
