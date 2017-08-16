//functions to access data from main electron thread
const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');
const { remote } = require('electron');

const SETTINGS_FILE = process.env.NODE_ENV === 'development' ?
											path.join(remote.app.getAppPath(),'AnalytixInstallerSettings.json') :
											path.join(path.dirname(remote.app.getPath('exe')),'AnalytixInstallerSettings.json');


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
}

const installAnalytix = productionFolder => {
	let rootDataDir = getLocalPath('');
	let groupASARBase = '/include/GroupEditor/resources';
	let variableASARBase = '/include/VariableEditor/resources';
	let groupASARLocation = getLocalPath(groupASARBase);
	let variableASARLocation = getLocalPath(variableASARBase);
	//We need to rename the ASAR files, because node thinks they are actual directories
	let asarToHoldArray = [];
	asarToHoldArray.push(fs.rename(path.join(groupASARLocation, 'app.asar'), path.join(groupASARLocation, 'app.hold')));
	asarToHoldArray.push(fs.rename(path.join(groupASARLocation, 'electron.asar'), path.join(groupASARLocation, 'electron.hold')));
	asarToHoldArray.push(fs.rename(path.join(variableASARLocation, 'app.asar'), path.join(variableASARLocation, 'app.hold')));
	asarToHoldArray.push(fs.rename(path.join(variableASARLocation, 'electron.asar'), path.join(variableASARLocation, 'electron.hold')));
	//--Setup the renaming of the .hold back to .asar in the data directory and also in the newly copied Analytix install directory
	let renameToASAR = () => {
		let backToASARArray = [];
		backToASARArray.push(fs.rename(path.join(groupASARLocation, 'app.hold'), path.join(groupASARLocation, 'app.asar')));
		backToASARArray.push(fs.rename(path.join(groupASARLocation, 'electron.hold'), path.join(groupASARLocation, 'electron.asar')));
		backToASARArray.push(fs.rename(path.join(variableASARLocation, 'app.hold'), path.join(variableASARLocation, 'app.asar')));
		backToASARArray.push(fs.rename(path.join(variableASARLocation, 'electron.hold'), path.join(variableASARLocation, 'electron.asar')));
		//add the renaming of the .hold files in the newly installed Analytix directory
		backToASARArray.push(fs.rename(path.join(productionFolder, groupASARBase, 'app.hold'), path.join(productionFolder, groupASARBase, 'app.asar')));
		backToASARArray.push(fs.rename(path.join(productionFolder, groupASARBase, 'electron.hold'), path.join(productionFolder, groupASARBase, 'electron.asar')));
		backToASARArray.push(fs.rename(path.join(productionFolder, variableASARBase, 'app.hold'), path.join(productionFolder, variableASARBase, 'app.asar')));
		backToASARArray.push(fs.rename(path.join(productionFolder, variableASARBase, 'electron.hold'), path.join(productionFolder, variableASARBase, 'electron.asar')));
		return backToASARArray;
	}
	//Start the install process.  First renaming all the .asar files to .hold
	return Promise.all(asarToHoldArray)
		.then(() => {
			console.log('Rename of ASAR files complete');
			//Copy Anaytix files to new directory
			return fs.copy(rootDataDir, productionFolder)
				.then(() => {
					console.log('Copy of files to Analytix Install Directory complete');
					//Now rename all the .hold back to .asar
					return Promise.all(renameToASAR())
						.then(() => {
							console.log('Rename of .hold back to .asar complete');
							return ('finished');
						});
				})
				.catch(err => {
					console.log('Error Installing Analytix', err);
					return ('error');
				});
		});
}


module.exports = {
	getLocalPath,
	guessBackupDir,
	installAnalytix
}
