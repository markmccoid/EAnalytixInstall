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
import UpgradeCreateBackup from './Upgrade/UpgradeCreateBackup';

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


class MainContainer extends React.Component {
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
	//--Upgrade functions
	//------------------
	createUpgradeBackup = (prodFolder, backupFolder) => {
		this.setState({status: 'working'});
		return nativeFileAccess.productionBackup(prodFolder, backupFolder)
			.then(response => {
				this.setState({status: response.status, statusMessage: response.msg});
			});
	}
	upgradeAnalytixFiles = (prodFolder = this.state.productionFolder, backupFolder = this.state.backupFolder) => {
		this.setState({status: 'working'});
		return nativeFileAccess.upgradeAnalytixFiles(prodFolder, backupFolder)
			.then(response => {
				this.setState({status: response.status, statusMessage: response.msg});
			});
	}
	render() {
		return (
			<Wrapper>
				<Switch>
					{/* sending through props to each rendered component because we need the history object to push next route/url onto history stack*/}
					<Route exact path="/" render={(props) => <InstallTypeSelect {...this.state} {...props} onChangeInstallType={this.changeInstallType} />} />
					{/*- Route for Installing OR Upgradig-- set folder locations  Setting component takes care of what to show for install versus upgrade -- -*/}
					<Route path="/(install|upgrade)/location" render={props => <Settings
							{...props}
							{...this.state}
							onStoreProductionFolder={this.storeProductionFolder}
							onStoreBackupFolder={this.storeBackupFolder}
						/>}
					/>
					{/*- Route for Installing -- allow user to perform install-- -*/}
					<Route path="/install/confirm" render={props => <InstallConfirm
							status={this.state.status}
							{...props}
							onInstallAnalytix={this.installAnalytix}
						/>}
					/>
					{/*- Route for Upgrade -- creating the backup -- -*/}
					<Route path="/upgrade/backup" render={props => <UpgradeCreateBackup
							{...this.state}
							{...props}
							currStep="backup"
							onCreateUpgradeBackup={this.createUpgradeBackup}
							onUpgradeAnalytixFiles={this.upgradeAnalytixFiles}
						/>}
					/>
					{/*- Route for Upgrade -- Copying the New Files -- -*/}
					<Route path="/upgrade/copyfiles" render={props => <UpgradeCreateBackup
							{...this.state}
							{...props}
							currStep="copyfiles"
							onCreateUpgradeBackup={this.createUpgradeBackup}
							onUpgradeAnalytixFiles={this.upgradeAnalytixFiles}
						/>}
					/>
				</Switch>

				<StateDisplay {...this.state} />
			</Wrapper>
		);
	}
}

export default MainContainer;
