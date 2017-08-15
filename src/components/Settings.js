import React from 'react';
import styled  from 'styled-components';
import { Button } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';
const { remote } = require('electron');
const dialog = remote.dialog;

const nativeFileAccess = window.require('../app/nativeFileAccess');
import { Header } from './CommonStyled';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	margin: 10px;
`;

class Settings extends React.Component {
	state = {
		productionFolder: '',
		backupFolder: ''
	};
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
		this.props.onStoreProductionFolder(folderSelected);
	}
	//---
	selectBackupFolder = () => {
		let folderSelected = this.showFolderDialog('Select Analytix Backup Folder');
		this.props.onStoreBackupFolder(folderSelected);
		}
	//-------------------------
	render() {

		return (
			<Wrapper>
				<Header textAlign="left">Select location of Analytix production directory</Header>
				<Input
					size="small my-input-size"
					icon={{ name: 'folder open outline', circular: true, link: true, onClick: this.selectProductionFolder}}
					placeholder='Choose Production Folder...'
					value={this.props.productionFolder}
				/>
				<br />
				<Header textAlign="left">Select backup directory or accept suggested directory</Header>
				<Input
					size="small my-input-size"
					icon={{ name: 'folder open outline', circular: true, link: true, onClick: this.selectBackupFolder}}
					placeholder='Choose Backup Folder...'
					value={this.props.backupFolder}
				/>
			</Wrapper>
		)
	}
}

export default Settings;
