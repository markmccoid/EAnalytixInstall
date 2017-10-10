var fs = require('fs-extra');
var path = require('path');
var fileHound = require('filehound');
const { renameAsarToHold, renameHoldToAsar } = require('../copyIncludeDir');

let getCurrDateTime = require('../helpers').getCurrDateTime;
//-------------------------------------
//--Backup Producion directory
//--CALL productionBackup() to start backup
//-------------------------------------
//--Once we have ensured backup dir exists (if not created it)
// //--we start the backup.
// const productionBackup = () => {
//   fs.ensureDir(BAK_DIR, err => {
//       if (err) console.log('ensureDir', err);
//       return startProdBackup();
//   });
// }
const productionBackup = (PROD_DIR, UPG_DIR, BAK_DIR) => {
  let logContents = getCurrDateTime() + '- Start Production Backup\n';
  //-- console.log('Start Production Backup');
  //Copy the directories that we want all files:
  try {
    fs.ensureDirSync(BAK_DIR);
    //QVW directory
    fs.copySync(path.join(PROD_DIR, 'QVW'), path.join(BAK_DIR, 'QVW'));
    logContents += getCurrDateTime() + '- Copied -- PROD/QVW to BAK/QVW\n';
    //-- console.log('Copied -- PROD/QVW to BAK/QVW');
    //SOURCE directory
    fs.copySync(path.join(PROD_DIR, 'source'), path.join(BAK_DIR, 'SOURCE'));
    logContents += getCurrDateTime() + '- Copied -- PROD/SOURCE to BAK/SOURCE\n';
    //-- console.log('Copied -- PROD/SOURCE to BAK/SOURCE');
  } catch (e) {
    logContents += getCurrDateTime() + '- Error copying QVW/SOURCE Directories\n' + e + '\n';
    //-- console.log('Error copying Include or QVW or SOURCE Directories', e);
  }
  //QVD directory
  //Find all files that DO NOT have a QVD Extension
  const QVDFiles = fileHound.create()
    .paths(path.join(PROD_DIR, 'QVD'))
    .discard('\\.[qQ][vV][dD]')
    .find();

  //Get the connection files BIConnection.txt, etc for copying
  const connectFiles = fileHound.create()
    .paths(PROD_DIR)
    .glob('*Connection.txt*')
    .find();

  //Create array of promises to process
  let backupPromiseArray = [];
  //connectFiles is a promise, when returns copy each file to the BAK directory
  backupPromiseArray.push(connectFiles
    .then((theFiles) => {
      theFiles.forEach((theFile) => {
        fs.copySync(path.normalize(theFile), path.join(BAK_DIR, path.basename(theFile)));
        logContents += `${getCurrDateTime()}- Copied \n FROM ${path.normalize(theFile)} \n TO   ${path.join(BAK_DIR, path.basename(theFile))}\n`;
        //-- console.log(`Copying from ${path.normalize(theFile)} to ${path.join(BAK_DIR, path.basename(theFile))}`);
      });
    })
  );

  //QVDFiles is a promise, when returns copy each file to the BAK/QVD directory
  backupPromiseArray.push(QVDFiles
    .then((theFiles) => {
      //Make sure directory exists and then copy the files over.
      fs.ensureDirSync(path.join(BAK_DIR, 'QVD'));
      //Loop through each file and copy it to the backup destination
      theFiles.forEach((theFile) => {
        logContents += `${getCurrDateTime()}- Copied \n FROM ${path.normalize(theFile)} \n TO   ${path.join(BAK_DIR, 'QVD', path.basename(theFile))}\n`;
        //-- console.log(`Copying from ${path.normalize(theFile)} to ${path.join(BAK_DIR, 'QVD', path.basename(theFile))}`);
        fs.copySync(path.normalize(theFile), path.join(BAK_DIR, 'QVD', path.basename(theFile)));
      });
    })
  );

  //Copy the include directory
  let includePathSource = path.join(PROD_DIR, 'Include');
  let includePathDest = path.join(BAK_DIR, 'Include');

  backupPromiseArray.push(renameAsarToHold(includePathSource) //--rename .asar to .hold in the source dir
    .then(() => fs.copy(includePathSource, includePathDest)) //--copy analytix files to their new home
    .then(() => renameHoldToAsar(includePathSource)) //--rename .hold back to .asar in the data directory
    .then(() => renameHoldToAsar(includePathDest)) //--rename .hold back to .asar in the newly installed dir.
    .then(() => logContents += `${getCurrDateTime()}- Include directory copied\n`)
  );

  //Create a promise that will resolve when both fileHound file lists have been processed.
  const returnPromise = new Promise((resolve, reject) => {
    Promise.all(backupPromiseArray)
      .then(() => {
        logContents += `Analytix files in \r\n ${PROD_DIR} \r\n backed up to \r\n ${BAK_DIR}\r\n`;
        logContents += '===============================================================';
        fs.writeFileSync(path.join(UPG_DIR, 'UPG_ProductionBackup.log'), logContents);
        resolve(0);
      })
      .catch((e) => reject(e));
  });
  return returnPromise;
};

module.exports = productionBackup;
