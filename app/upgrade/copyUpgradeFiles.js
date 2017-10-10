var fs = require('fs-extra');
var path = require('path');
var fileHound = require('filehound');

const { renameAsarToHold, renameHoldToAsar } = require('../copyIncludeDir');
var getCurrDateTime = require('../helpers').getCurrDateTime;

// Copy from UPG to PROD the following:
//   - .\SOURCE -> *.QVW
//   - .\QVD -> *.QVW
//   - .\QVW -> copy the QVW overs, but prefix them with UPG_
//   - .\Include\*.qvs
//   - .\Include\Image\*.*
//   - .\Include\SystemQVW\*.*
//   - .\Include\VariableEditor\
//     - Copy everything except the qvVariables.json, copy it as UPG_qvVariables.json
const copyUpgradeFiles = (PROD_DIR, UPG_DIR, BAK_DIR) => {
  let logContents = getCurrDateTime() + '- Start Copy Upgrade Files\n';
  //  console.log('Start Copy Upgrade Files');
  //------ASYNC Operations below --------
  //-------------------------------------

  //====================================
  //== Include directory START
  //====================================
  let IncludeArraySTEP1 = [];
  let IncludeArraySTEP3 = [];

  //1. RENAME PROD/VariableEditor/--> qvVariable.json to SITE_qvVariables.json and GroupEditor/--> qvGroups.json to SITE_qvGroups.json
  IncludeArraySTEP1.push(fs.rename(path.join(PROD_DIR, 'Include/VariableEditor/data', 'qvVariables.json'), path.join(PROD_DIR, 'Include/VariableEditor/data', 'SITE_qvVariables.json')));
  IncludeArraySTEP1.push(fs.rename(path.join(PROD_DIR, 'Include/GroupEditor/data', 'qvGroups.json'), path.join(PROD_DIR, 'Include/GroupEditor/data', 'SITE_qvGroups.json')));

  //2. RENAME asar files in UPG dir to .hold
  // --> renameAsarToHold(path.join(UPG_DIR, '/Include'));
  //3. COPY UPG/Include direcotries to production folder (overwriting existing files)
  IncludeArraySTEP3.push(fs.copy(path.join(UPG_DIR, 'Include/VariableEditor'), path.join(PROD_DIR, 'Include/VariableEditor')));
  IncludeArraySTEP3.push(fs.copy(path.join(UPG_DIR, 'Include/GroupEditor'), path.join(PROD_DIR, 'Include/GroupEditor')));
  IncludeArraySTEP3.push(fs.copy(path.join(UPG_DIR, 'Include/Images'), path.join(PROD_DIR, 'Include/Images')));
  IncludeArraySTEP3.push(fs.copy(path.join(UPG_DIR, 'Include/SystemQVW'), path.join(PROD_DIR, 'Include/SystemQVW')));
  //4. RENAME hold files in UPG dir to .asar
  // --> renameHoldToAsar(path.join(UPG_DIR, '/Include'));
  // --> renameHoldToAsar(path.join(PROD_DIR, '/Include'));
  //5. RENAME UPG/VariableEditor/--> UPG_qvVariable.json back to qvVariables.json and GroupEditor/--> UPG_qvGroups.json back to qvGroups.json
  // IncludeArraySTEP5.push(fs.rename(path.join(UPG_DIR, 'Include/VariableEditor/data', 'UPG_qvVariables.json'), path.join(UPG_DIR, 'Include/VariableEditor/data', 'qvVariables.json')));
  // IncludeArraySTEP5.push(fs.rename(path.join(UPG_DIR, 'Include/GroupEditor/data', 'UPG_qvGroups.json'), path.join(UPG_DIR, 'Include/GroupEditor/data', 'qvGroups.json')));

  //--Save Promise in variable.  Will execute in a Promise.all at end of this function.
  const includeFiles = Promise.all(IncludeArraySTEP1) //--Rename the qvVariables.json and qvGroups.json in UPG dir to have prefix of UPG_
    .then(() => renameAsarToHold(path.join(UPG_DIR, '/Include'))) //--rename .asar to .hold in the UPG dir
    .then(() => Promise.all(IncludeArraySTEP3)) //--copy the '/include/ directories upgrade files to their new home
    .then(() => renameHoldToAsar(path.join(UPG_DIR, '/Include'))) //--rename .hold back to .asar in the Upgrade directory
    .then(() =>  renameHoldToAsar(path.join(PROD_DIR, '/Include'))) //--rename .hold back to .asar in the Production directory
    //  .then(() => Promise.all(IncludeArraySTEP5)) //--rename the UPG_qvVariables and qvGroups.json files in UPG dir to not have the UPG Prefix.
    .then(() => {logContents += getCurrDateTime() + '-- Include Files processed ---\n';}) //--Log message to log file.
    .catch((e) => console.log(`ERROR in copyUPgradeFiles.js --> ${e}`));


  //====================================
  //== Include directory END
  //====================================
  //-------------
  //Find all QVW files that are in SOURCE Upgrade Directory - .\SOURCE -> *.QVW
  //-------------
  const sourceQVWfiles = fileHound.create()
    .paths(path.join(UPG_DIR, 'SOURCE'))
    .ext('qvw')
    .find()
    .then((theFiles) => {
      //Loop through each file and copy it to the backup destination
      theFiles.forEach((theFile) => {
        fs.copySync(path.normalize(theFile), path.join(PROD_DIR, 'SOURCE', path.basename(theFile)));
        //console.log(`Copying from ${path.normalize(theFile)} to ${path.join(PROD_DIR, 'SOURCE', path.basename(theFile))}`);
        logContents += `${getCurrDateTime()}- Copying \n FROM ${path.normalize(theFile)} \n TO   ${path.join(PROD_DIR, 'SOURCE', path.basename(theFile))}\n`;
      });
    }
    );

  //-------------
  //Find all QVW files that are in QVD Upgrade Directory - .\QVD -> *.QVW
  //-------------
  const QVD_QVWfiles = fileHound.create()
    .paths(path.join(UPG_DIR, 'QVD'))
    .ext('qvw')
    .find()
    .then((theFiles) => {
      //Loop through each file and copy it to the backup destination
      theFiles.forEach((theFile) => {
        fs.copySync(path.normalize(theFile), path.join(PROD_DIR, 'QVD', path.basename(theFile)));
        //console.log(`Copying from ${path.normalize(theFile)} to ${path.join(PROD_DIR, 'QVD', path.basename(theFile))}`);
        logContents += `${getCurrDateTime()}- Copying \n FROM ${path.normalize(theFile)} \n TO   ${path.join(PROD_DIR, 'QVD', path.basename(theFile))}\n`;
      });
    }
    );

  //-------------
  //Find all QVW files that are in QVW Upgrade Directory - .\QVW -> copy the QVW overs, but prefix them with UPG_
  //-------------
  const QVWfiles = fileHound.create()
    .paths(path.join(UPG_DIR, 'QVW'))
    .ext('qvw')
    .find()
    .then((theFiles) => {
      //Loop through each file and copy it to the backup destination
      theFiles.forEach((theFile) => {
        fs.copySync(path.normalize(theFile), path.join(PROD_DIR, 'QVW', 'UPG_' + path.basename(theFile)));
        //console.log(`Copying from ${path.normalize(theFile)} to ${path.join(PROD_DIR, 'QVW', 'UPG_' + path.basename(theFile))}`);
        logContents += `${getCurrDateTime()}- Copying \n FROM ${path.normalize(theFile)} \n TO   ${path.join(PROD_DIR, 'QVW', 'UPG_' + path.basename(theFile))}\n`;
      });
    }
    );

  //Create a promise that will resolve when all fileHound file lists have been processed.
  const returnPromise = new Promise((resolve, reject) => {
    Promise.all([includeFiles, sourceQVWfiles, QVD_QVWfiles, QVWfiles])
      .then(() => {
        fs.writeFileSync(path.join(UPG_DIR, 'UPG_CopyUpgrade.log'), logContents);
        resolve(0);
      })
      .catch((e) => reject(e));
  });
  return returnPromise;
};
//------------------------------------
//--END Upgrade Copy Files
//------------------------------------

module.exports = copyUpgradeFiles;
