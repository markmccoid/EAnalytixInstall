import React from 'react';
import PropTypes from 'prop-types';
const { remote } = require('electron');
const dialog = remote.dialog;


import InstallSettings from './InstallSettings';
import UpgradeSettings from './UpgradeSettings';
import ProgressButtons from '../ProgressButtons';

class Settings extends React.Component {
  //---My functions
 showFolderDialog = (title) => {
   const dialogOptions = {
     title,
     properties: ['openFile', 'openDirectory']
   };
   let folderSelected = dialog.showOpenDialog(dialogOptions);
   return folderSelected ? folderSelected[0] : '';
 }
  //---
 selectProductionFolder = () => {
   let folderSelected = this.showFolderDialog('Select Analytix Production Folder');
   folderSelected = this.props.type === 'install' ? folderSelected + '\\Analytix' : folderSelected;
   this.props.onStoreProductionFolder(folderSelected);
 }
 manualFolderStore = (ProdOrBackup) => (folder) => {
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
   //Set the next action route based on if we are on Install or Upgrade path
   let nextAction = this.props.type === 'install' ? 'confirm' : 'backup';
   let btnPrevious = () => this.props.history.push('/');
   let btnNext = () => this.props.history.push(`/${this.props.type}/${nextAction}`);
   let settingsViewJSX;

   if (this.props.type === 'install') {
     settingsViewJSX = <InstallSettings {...this.props}
       onSelectProductionFolder={this.selectProductionFolder}
       onManualProductionFolder={this.manualFolderStore('prod')}
     />;
   } else {
     settingsViewJSX = <UpgradeSettings {...this.props}
       onSelectProductionFolder={this.selectProductionFolder}
       onSelectBackupFolder={this.selectBackupFolder}
       onManualProductionFolder={this.manualFolderStore('prod')}
       onManualBackupFolder={this.manualFolderStore('backup')}
     />;
   }
   return (
     <div>
       {settingsViewJSX}
       <br />
       <ProgressButtons
         onPreviousClick={btnPrevious}
         onNextClick={btnNext}
         nextBtnDisabled={this.props.productionFolder ? false : true}
       />
     </div>
   );
 }
}

Settings.propTypes = {
  productionFolder: PropTypes.string,
  backupFolder: PropTypes.string,
  type: PropTypes.string,
  onStoreProductionFolder: PropTypes.func,
  onManualProductionFolder: PropTypes.func,
  onStoreBackupFolder: PropTypes.func
};

export default Settings;
