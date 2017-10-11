const path = require('path');
const fs = require('fs-extra');
const _ = require('lodash');

let getCurrDateTime = () => {
  var date = new Date();

  var hour = date.getHours();
  hour = (hour < 10 ? '0' : '') + hour;
  var min  = date.getMinutes();
  min = (min < 10 ? '0' : '') + min;
  var sec  = date.getSeconds();
  sec = (sec < 10 ? '0' : '') + sec;
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  month = (month < 10 ? '0' : '') + month;
  var day  = date.getDate();
  day = (day < 10 ? '0' : '') + day;
  return year + '-' + month + '-' + day + '--' + hour + ':' + min + ':' + sec;
};

const createLogFile = (fullPath, fileName, logData) => {
  //This is a destructive call. If file exists, it will be overwritten
  fs.writeFileSync(path.join(fullPath, fileName), logData);
};
const updateLogFile = (fullPath, fileName, logData) => {
  //This is a destructive call. If file exists, it will be overwritten
  fs.appendFile(path.join(fullPath, fileName), logData);
};

module.exports = {
  getCurrDateTime,
  createLogFile,
  updateLogFile
};