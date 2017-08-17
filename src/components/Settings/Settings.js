import React from 'react';
import PropTypes from 'prop-types';
import styled  from 'styled-components';
import { Button } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';
const { remote } = require('electron');
const dialog = remote.dialog;

const nativeFileAccess = window.require('../app/nativeFileAccess');

import InstallSettings from './InstallSettings';
import UpgradeSettings from './UpgradeSettings';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	margin: 10px;
`;

class Settings extends React.Component {
	//---My functions
	showFolderDialog = title => {
		const dialogOptions = {
			title,
			properties: ['openFile', 'openDirectory']
		}
		let folderSelected = dialog.showOpenDialog(dialogOptions);
		return folderSelected ? folderSelected[0] : '';
	}
	//---
	selectProductionFolder = () => {
		let folderSelected = this.showFolderDialog('Select Analytix Production Folder');
		folderSelected = this.props.type === 'install' ? folderSelected + '\\Analytix' : folderSelected;
		this.props.onStoreProductionFolder(folderSelected);
	}
	manualFolderStore = ProdOrBackup => folder => {
		ProdOrBackup === 'prod' ?
		this.props.onStoreProductionFolder(folder) :
		this.props.onStoreBackupFolder(folder);
	}
	//---
	selectBackupFolder = () => {
		let folderSelected = this.showFolderDialog('Select Analytix Backup Folder');
		this.props.onStoreBackupFolder(folderSelected);
		}
	//-------------------------
	render() {
		if (this.props.type === 'install') {
			return (<InstallSettings {...this.props}
								onSelectProductionFolder={this.selectProductionFolder}
								onManualProductionFolder={this.manualFolderStore('prod')}
							/>);
		}
		return (<UpgradeSettings {...this.props}
							onSelectProductionFolder={this.selectProductionFolder}
							onSelectBackupFolder={this.selectBackupFolder}
							onManualProductionFolder={this.manualFolderStore('prod')}
							onManualBackupFolder={this.manualFolderStore('backup')}
						/>);
	}
}

Settings.propTypes = {
	productionFolder: PropTypes.string,
	backupFolder: PropTypes.string,
	type: PropTypes.string,
	onStoreProductionFolder: PropTypes.func,
	onManualProductionFolder: PropTypes.func,
	onStoreBackupFolder: PropTypes.func
}

export default Settings;
