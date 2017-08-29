var fs = require('fs-extra');
var path = require('path');
var fileHound = require('filehound');

let getCurrDateTime = () => {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + "-" + month + "-" + day + "--" + hour + ":" + min + ":" + sec;
};
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
  let logContents = getCurrDateTime() + '- Start Production Backup\n'
  console.log('Start Production Backup');
  //Copy the directories that we want all files:
  try {
    fs.ensureDirSync(BAK_DIR);
    //QVW directory
    fs.copySync(path.join(PROD_DIR, 'QVW'), path.join(BAK_DIR, 'QVW'));
    logContents += getCurrDateTime() + '- Copied -- PROD/QVW to BAK/QVW\n';
    console.log('Copied -- PROD/QVW to BAK/QVW');
    //SOURCE directory
    fs.copySync(path.join(PROD_DIR, 'source'), path.join(BAK_DIR, 'SOURCE'));
    logContents += getCurrDateTime() + '- Copied -- PROD/SOURCE to BAK/SOURCE\n';
    console.log('Copied -- PROD/SOURCE to BAK/SOURCE');
		//include Directory
    fs.copySync(path.join(PROD_DIR, 'Include'), path.join(BAK_DIR, 'Include'));
    logContents += getCurrDateTime() + '- Copied -- PROD/Include to BAK/Include\n';
    console.log('Copied -- PROD/Include to BAK/Include');
  } catch (e) {
    logContents += getCurrDateTime() + '- Error copying Include/QVW/SOURCE Directories\n';
    console.log('Error copying Include or QVW or SOURCE Directories', e);
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
    .ext('txt')
    .find();

  //connectFiles is a promise, when returns copy each file to the BAK directory
  connectFiles
    .then(theFiles => {
      theFiles.forEach(theFile => {
        fs.copySync(path.normalize(theFile), path.join(BAK_DIR, path.basename(theFile)));
        logContents += `${getCurrDateTime()}- Copied \n FROM ${path.normalize(theFile)} \n TO   ${path.join(BAK_DIR, path.basename(theFile))}\n`;
        console.log(`Copying from ${path.normalize(theFile)} to ${path.join(BAK_DIR, path.basename(theFile))}`);
      });
    })
    .catch(e => console.log('Error copying connect files', e));

  //QVDFiles is a promise, when returns copy each file to the BAK/QVD directory
  QVDFiles
    .then(theFiles => {
      //Make sure directory exists and then copy the files over.
      fs.ensureDirSync(path.join(BAK_DIR, 'QVD'));
        //Loop through each file and copy it to the backup destination
        theFiles.forEach(theFile => {
          logContents += `${getCurrDateTime()}- Copied \n FROM ${path.normalize(theFile)} \n TO   ${path.join(BAK_DIR, 'QVD', path.basename(theFile))}\n`;
          console.log(`Copying from ${path.normalize(theFile)} to ${path.join(BAK_DIR, 'QVD', path.basename(theFile))}`);
          fs.copySync(path.normalize(theFile), path.join(BAK_DIR, 'QVD', path.basename(theFile)));
        });
  });

//Create a promise that will resolve when both fileHound file lists have been processed.
  const returnPromise = new Promise((resolve, reject) => {
    Promise.all([connectFiles, QVDFiles])
      .then(values => {
          fs.writeFileSync(path.join(UPG_DIR, 'UPG_ProductionBackup.log'), logContents);
          resolve(0)
        })
      .catch(e => reject(1));
  });
  return returnPromise;
};

module.exports = productionBackup;
