//functions to access data from main electron thread
const path = require('path');
const fs = require('fs');
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
	console.log(path.join(productionFolder, '../BackupAnalytix'));
	return path.join(productionFolder, '../BackupAnalytix');
}
module.exports = {
	getLocalPath,
	guessBackupDir
}
