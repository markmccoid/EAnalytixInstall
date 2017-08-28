import React from 'react';
import styled  from 'styled-components';
import { Button } from 'semantic-ui-react'
import { Step } from 'semantic-ui-react'
import {
  BrowserRouter,
  Route,
	Switch,
	Redirect,
	withRouter
} from 'react-router-dom';

const nativeFileAccess = window.require('../app/nativeFileAccess');

import InstallTypeSelect from './InstallTypeSelect';
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


class Routes extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
				productionFolder: '',
				backupFolder: '',
				type: 'install', //or 'upgrade'
				status: undefined, // or 'working' set status to working when installing or upgrading, 'finished' = success
				statusMessage: undefined,
				currentStep: 1
			};
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
		if (newStep === 2) {
			this.props.history.push(`/${this.state.type}/location`);
		}
		this.setState({currentStep: newStep});
	}
	//-------------------------------
	//--Update install type state
	changeInstallType = newType => {
		this.setState({type: newType});
	}

	//
	installAnalytix = () => {
		this.setState({status: 'working'});
		nativeFileAccess.installAnalytix(this.state.productionFolder)
			.then(installStatus => {
				this.setState({status: installStatus.status, statusMessage: installStatus.msg});
			});
	}
	clearInstallError = () => {
		this.setState({status: undefined, statusMessage: undefined})
	}
	//------------------
	render() {
		return (
			<Wrapper>
				<Switch>
					<Route exact path="/" render={(props) => <InstallTypeSelect {...this.state} {...props} onChangeInstallType={this.changeInstallType} />} />
					{/*- Route for Installing OR Upgradig-- set folder locations  Setting component takes care of what to show for install versus upgrade -- -*/}
					<Route path="/(install|upgrade)/location" render={props => <Settings
							{...props}
							{...this.state}
							onStoreProductionFolder={this.storeProductionFolder}
							onStoreBackupFolder={this.storeBackupFolder}
						/>}
					/>
					{/*- Route for Installing -- start install-- -*/}
					<Route path="/install/confirm" render={props => <InstallConfirm
							status={this.state.status}
							{...props}
							onInstallAnalytix={this.installAnalytix}
						/>}
					/>
				</Switch>

				<StateDisplay {...this.state} />
			</Wrapper>
		);
	}
}

export default Routes;
