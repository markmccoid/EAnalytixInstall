//-------------------------------------------------------
//--mergeFiles.js has two functions:
//--mergeQVVars which reads the SITE_qvVariables.json and qvVariables.json
//--	and takes all the user modified items in SITE_qvVariables and replaces them
//--	in the qvVariables.json.
//--	Lastly it writes/overwrites the qvVariables.json file
//--
//--mergeQVGroups which does the same thing, but on the qvGroups.json file.
//-------------------------------------------------------
const fs = require('fs-extra');
const path = require('path');

//Create a function that accepts a filename and returns a promise
//that will resolve with the file contents when done being read
const fileReadPromise = file => {
 	return new Promise((resolve, reject) => {
	  fs.readFile(file, 'utf8', (err, data) => {
	    if (err) {
	      reject(Error(err));
	    }
	    resolve(data);
	  });
	});
 };

 const fileWritePromise = file => {
  	return new Promise((resolve, reject) => {
 	  fs.readFile(file, 'utf8', (err, data) => {
 	    if (err) {
 	      reject(Error(err));
 	    }
 	    resolve(data);
 	  });
 	});
  };

//--Entry point for merging the QVVars files
const mergeQVVars = (siteQVVarsFile, upgQVVarsFile, PROD_DIR) => {
	//Pass an array of promises (created by our fileReadPromise function) to read multiple files
	//Once all promised have been resolved, call the processFiles function
	//First file passed is the SiteFile JSON
	//Second file passed is the upgradeFile JSON
	return Promise.all([fileReadPromise(siteQVVarsFile), fileReadPromise(upgQVVarsFile)])
	 	.then(data => QVVarsMergeProcess(data, PROD_DIR));
};

//Function that will process the files once they have been read
//This is the main function that does the compare and creates the new final qvVariables.json file
const QVVarsMergeProcess = (filesArray, PROD_DIR) => {
	//Load and parse the siteFile and upgradeFile
	let siteFile = JSON.parse(filesArray[0]);
	let upgradeFile = JSON.parse(filesArray[1]);
	//Convert the upgradeFile array to an object:
	// {id: {name, description, ...}}
	// id will be the uuid.  The idea being that we can more easily replace user modified variables
	var upgradeObject = upgradeFile.reduce((newObj, currItem) => {
	  newObj[currItem.id] = currItem;
	  return newObj;
	}, {});
	//!! Array to hold the files we are going to write
	let writeArray = [];
	//Get all the objects that have been modified by a user
	let userModified = siteFile.filter(varObj => varObj.modifyUser === 'user');

	//let userModifiedToWrite = userModified; //because we are making changed directly to userModified later -- I know be immutable -- just lazy right now.
	//!!Push a write promise to writeArray that will write out the userModified file for a reference
	writeArray.push(fs.writeFile(path.join(PROD_DIR, 'Include/VariableEditor/data/qvVarsUserModified.JSON'), JSON.stringify(userModified)));

	//Loop through the usermodified array and replace in the upgradeObject, the items that have been userModified
  userModified.forEach(varObj => upgradeObject[varObj.id] = varObj);
  //Convert upgradeObject back into an array:
  let newUpgradeFile = Object.keys(upgradeObject).map(objKey => upgradeObject[objKey]);

	//!!Push a write promise to writeArray that will write out the new qvVariables.json file
	writeArray.push(fs.writeFile(path.join(PROD_DIR, 'Include/VariableEditor/data/qvVariables.JSON'), JSON.stringify(newUpgradeFile)));

	return Promise.all(writeArray)
		.then(fs.remove(path.join(PROD_DIR, 'Include/VariableEditor/data/SITE_qvVariables.JSON')))
		.then(() => 'qvVariable and SITE_qvVariable files merged.')
		.catch((err) => `Merge Files Error: ${err}`);
  // //write out the new file
  // fs.writeFile(path.join(PROD_DIR, 'Include/VariableEditor/data/qvVariables.JSON'), JSON.stringify(newUpgradeFile), err => {
  //   if (err) throw err;
  //   console.log('qvVariables.JSON written');
	// 	return 'qvVars Merge Complete';
  // });

};

module.exports = {
	mergeQVVars
}
