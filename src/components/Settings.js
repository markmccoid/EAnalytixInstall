import React from 'react';
import styled  from 'styled-components';
import { Button } from 'semantic-ui-react';
import { Input } from 'semantic-ui-react';
const { remote } = require('electron');
const dialog = remote.dialog;

const nativeFileAccess = window.require('../app/nativeFileAccess');

const Wrapper = styled.div`
	display: flex;
	padding: 10px;
	margin: 10px;
`;

class Settings extends React.Component {
	state = {
		productionFolder: '',
		backupFolder: ''
	};
	showFolderDialog = title => {
		const dialogOptions = {
			title,
			properties: ['openFile', 'openDirectory']
		}
		let folderSelected = dialog.showOpenDialog(dialogOptions);
		return folderSelected ? folderSelected[0] : '';
	}
	selectProductionFolder = () => {
		let folderSelected = this.showFolderDialog('Select Analytix Production Folder');

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
	selectBackupFolder = () => {
		let folderSelected = this.showFolderDialog('Select Analytix Backup Folder');
		this.setState({
				backupFolder: folderSelected
			});
		}

	render() {

		return (
			<Wrapper>
				<Input
					size="small my-input-size"
					icon={{ name: 'folder open outline', circular: true, link: true, onClick: this.selectProductionFolder}}
					placeholder='Choose Production Folder...'
					value={this.state.productionFolder}
				/>
				<br />
				<Input
					size="small my-input-size"
					icon={{ name: 'folder open outline', circular: true, link: true, onClick: this.selectBackupFolder}}
					placeholder='Choose Backup Folder...'
					value={this.state.backupFolder}
				/>

			</Wrapper>
		)
	}
}

export default Settings;
