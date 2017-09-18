//functions to access data from main electron thread
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { remote } = require('electron');

const prodBackup = require('./upgrade/productionBackup');
const copyUpgradeFiles = require('./upgrade/copyUpgradeFiles');
const { renameAsarToHold, renameHoldToAsar } = require('./copyIncludeDir');
const { mergeQVVars, mergeQVGroups, writeXMLData } = require('./upgrade/mergeFiles');
console.log(mergeQVVars);
// const SETTINGS_FILE = process.env.NODE_ENV === 'development' ?
//   path.join(remote.app.getAppPath(),'AnalytixInstallerSettings.json') :
//   path.join(path.dirname(remote.app.getPath('exe')),'AnalytixInstallerSettings.json');


//Can't access the remote.app. feature except from within a function.  Probably after app has loaded.
//passed either GROUPS_FILE or FIELDS_FILE, will return the path, relative to where the GroupCreate.EXE
//is located.
//--getLocalPath will return the full path to the directory passed
//--OR if a filename is passed it will return the full path to the file along with the filename
//--If '/dir1/subdir' passed then 'c:.../dir1/subdir' returned
//--If 'filename.json' passed then 'c:.../filename.json' returned
//--If '/dir1/filename.json' passed then 'c:.../dir1/filename.json' returned
const getLocalPath = (dataFileOrDir) => {
  if (process.env.NODE_ENV === 'development') {
    return path.join(remote.app.getAppPath(), '/data', dataFileOrDir);
  }
  return path.join(path.dirname(remote.app.getPath('exe')), '/data', dataFileOrDir);
};

//--guessBackupDir will take the productionFolder and go back one dir (../), append
//--AnalytixBackup to it and return the full path.
//--Example: productionFolder = 'C:\Analytix'
//--Guessed Backup Dir = 'C:\BackupAnalytix'
const guessBackupDir = (productionFolder) => {
  return path.join(productionFolder, '../BackupAnalytix');
};

const stringifyError = (errObj) => {
  let err = [];
  if (typeof errObj === 'object') {
    for (var property in errObj) {
      err.push(`${property}: ${errObj[property]}`);
    }
    return err.join('__');
  }
  //else not an object so just return what was passed
  return errObj;


};
//-------------------------------------------
//--Install Analytix to 'productionFolder'
const installAnalytix = (productionFolder) => {
  let rootDataDir = getLocalPath('');
  // let groupASARBase = '/include/GroupEditor/resources';
  // let variableASARBase = '/include/VariableEditor/resources';
  // let groupASARLocation = getLocalPath(groupASARBase);
  // let variableASARLocation = getLocalPath(variableASARBase);

  let includePathSource = getLocalPath('/Include');
  let includePathDest = path.join(productionFolder, '/Include');

  return renameAsarToHold(includePathSource) //--rename .asar to .hold
    .then(() => fs.copy(rootDataDir, productionFolder)) //--copy analytix files to their new home
    .then(() => renameHoldToAsar(includePathSource)) //--rename .hold back to .asar in the data directory
    .then(() => renameHoldToAsar(includePathDest)) //--rename .hold back to .asar in the newly installed dir.
    .then(() => ({status: 'finished', msg: 'Analytix Installation Complete'})) //--return 'finished' status
    .catch((err) => ({status: 'error', msg: stringifyError(err)})); //--if error return 'error' status
};

//--Backs up production folder to the designated backup folder.
//--Not a straight copy, doesn't backup QVD files, etc.
const productionBackup = (productionFolder, backupFolder) => {
  let upgradeFolder = getLocalPath('');
  console.log(upgradeFolder);
  return prodBackup(productionFolder, upgradeFolder, backupFolder)
    .then(() => ({status: 'finished', msg: 'Analytix Backup Complete'}))
    .catch((err) => ({status: 'error', msg: stringifyError(err)}));
};

//--Copies the upgrade files into the production folder.  backupFolder is not currently used.
const upgradeAnalytixFiles = (productionFolder, backupFolder = '') => {
  let upgradeFolder = getLocalPath('');
  return copyUpgradeFiles(productionFolder, upgradeFolder, backupFolder)
    .then(() => ({status: 'finished', msg: 'Analytix Copy Files Complete'}))
    .catch((err) => ({status: 'error', msg: stringifyError(err)}));
};

//--Merges the qvVariables.json from upgrade with the production version then writes out new XML filess to spreadsheet directory.
//--Merges the qvGroups.json from upgrade with the production version then writes out new XML filess to spreadsheet directory.
const mergeFiles = (productionFolder) => {
  let upgradeFolder = getLocalPath('');
  let siteQVVarsFile = path.join(productionFolder, 'include/VariableEditor/data/SITE_qvVariables.json');
  let upgQVVarsFile = path.join(productionFolder, 'include/VariableEditor/data/qvVariables.json');

  return mergeQVVars(siteQVVarsFile, upgQVVarsFile, productionFolder)
    .then(exportVariableXMLFiles(productionFolder))
    .then(mergeQVGroups(siteQVVarsFile, upgQVVarsFile, productionFolder))
    .then(exportGroupXMLFiles(productionFolder))
    .then((response) => ({status: 'finished', msg: response}))
    .catch((err) => ({status: 'error', msg: stringifyError(err)}));
};

const exportVariableXMLFiles = (productionFolder) => {
  let spreadsheetFolder = path.join(productionFolder, '/Include/Spreadsheets');
  let qvVarsFile = path.join(productionFolder, '/Include/VariableEditor/data/qvVariables.json');
  let qvVarsObj = JSON.parse(fs.readFileSync(qvVarsFile));
  let applicationList = _.uniq(qvVarsObj.map((varObj) => varObj.application));
  //--will return a promise
  return writeXMLData(applicationList, qvVarsObj, spreadsheetFolder, 'variable');
};
const exportGroupXMLFiles = (productionFolder) => {
  let spreadsheetFolder = path.join(productionFolder, '/Include/Spreadsheets');
  let qvVarsFile = path.join(productionFolder, '/Include/GroupEditor/data/qvgroups.json');
  let qvVarsObj = JSON.parse(fs.readFileSync(qvVarsFile));
  let applicationList = _.uniq(qvVarsObj.map((varObj) => varObj.application));
  //--will return a promise
  return writeXMLData(applicationList, qvVarsObj, spreadsheetFolder, 'group');
};

module.exports = {
  getLocalPath,
  guessBackupDir,
  installAnalytix,
  productionBackup,
  upgradeAnalytixFiles,
  mergeFiles
};
