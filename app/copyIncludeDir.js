var fs = require('fs-extra');
var path = require('path');

//--It seems that the asar file extension cannot be found using fileHound.
//--Instead we will have to target the files directly.

//==-==-==-==-==-
//--Rename .ASAR to .HOLD
//--Pass include directory where you want the rename to occur
const renameAsarToHold = (includeDir) => {
  let groupASARLocation = path.join(includeDir, '/GroupEditor/resources');
  let variableASARLocation = path.join(includeDir, '/VariableEditor/resources');

  //We need to rename the ASAR files, because node thinks they are actual directories
  let asarToHoldArray = [];
  asarToHoldArray.push(fs.rename(path.join(groupASARLocation, 'app.asar'), path.join(groupASARLocation, 'app.hold')));
  asarToHoldArray.push(fs.rename(path.join(groupASARLocation, 'electron.asar'), path.join(groupASARLocation, 'electron.hold')));
  asarToHoldArray.push(fs.rename(path.join(variableASARLocation, 'app.asar'), path.join(variableASARLocation, 'app.hold')));
  asarToHoldArray.push(fs.rename(path.join(variableASARLocation, 'electron.asar'), path.join(variableASARLocation, 'electron.hold')));

  return Promise.all(asarToHoldArray);
};

//==-==-==-==-==-
//--Rename .HOLD to .ASAR
const renameHoldToAsar = (includeDir) => {
  let groupASARLocation = path.join(includeDir, '/GroupEditor/resources');
  let variableASARLocation = path.join(includeDir, '/VariableEditor/resources');

  //--Rename the hold back to asar files.
  let backToASARArray = [];
  backToASARArray.push(fs.rename(path.join(groupASARLocation, 'app.hold'), path.join(groupASARLocation, 'app.asar')));
  backToASARArray.push(fs.rename(path.join(groupASARLocation, 'electron.hold'), path.join(groupASARLocation, 'electron.asar')));
  backToASARArray.push(fs.rename(path.join(variableASARLocation, 'app.hold'), path.join(variableASARLocation, 'app.asar')));
  backToASARArray.push(fs.rename(path.join(variableASARLocation, 'electron.hold'), path.join(variableASARLocation, 'electron.asar')));

  return Promise.all(backToASARArray);
};

module.exports = {
  renameAsarToHold,
  renameHoldToAsar
}
