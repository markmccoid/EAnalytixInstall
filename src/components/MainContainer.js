import React from 'react';
import styled  from 'styled-components';
import {
  Route,
  Switch
} from 'react-router-dom';

const nativeFileAccess = window.require('../app/nativeFileAccess');

import InstallTypeSelect from './InstallTypeSelect';
import Settings from './Settings/Settings';
import StateDisplay from './StateDisplay';
import InstallConfirm from './Install/InstallConfirm';
import UpgradeSteps from './Upgrade/UpgradeSteps';


const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 900px;
`;


class MainContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productionFolder: '',
      backupFolder: '',
      type: 'install', //or 'upgrade'
      status: undefined, // or 'working' set status to working when installing or upgrading, 'finished' = success
      statusMessage: undefined,
      currUpgradeStep: 'backup'
    };
  }

  //------My functions
  //--Update the productionFolder state value
  storeProductionFolder = (folderSelected) => {
    this.setState((prevState) => {
      //If previous state of backupFolder not populated, then guess otherwise leave alone
      let newBackupFolder = !prevState.backupFolder ?
        nativeFileAccess.guessBackupDir(folderSelected) :
        prevState.backupFolder;
      return ({
        productionFolder: folderSelected,
        backupFolder: newBackupFolder
      });
    });
  }
  //--Update the backupFolder state value
  storeBackupFolder = (folderSelected) => {
    this.setState({
      backupFolder: folderSelected
    });
  }
  //--Update the current upgrade step state value
  setUpgradeStep = (newStep) => {
    this.setState({currUpgradeStep: newStep});
  }
  //-------------------------------
  //--Update install type state
  changeInstallType = (newType) => {
    this.setState({type: newType});
  }

  //
  installAnalytix = () => {
    this.setState({status: 'working'});
    nativeFileAccess.installAnalytix(this.state.productionFolder)
      .then((installStatus) => {
        this.setState({status: installStatus.status, statusMessage: installStatus.msg});
      });
  }
  clearInstallError = () => {
    this.setState({status: undefined, statusMessage: undefined});
  }
  //------------------
  //--Upgrade functions
  //------------------
  createUpgradeBackup = (prodFolder, backupFolder) => {
    this.setState({status: 'working'});
    return nativeFileAccess.productionBackup(prodFolder, backupFolder)
      .then((response) => {
        this.setState({status: response.status, statusMessage: response.msg});
        return response;
      });
  }
  upgradeAnalytixFiles = (prodFolder = this.state.productionFolder, backupFolder = this.state.backupFolder) => {
    this.setState({status: 'working'});
    return nativeFileAccess.upgradeAnalytixFiles(prodFolder, backupFolder)
      .then((response) => {
        this.setState({status: response.status, statusMessage: response.msg});
      });
  }
  mergeFiles = (prodFolder) => {
    this.setState({status: 'working'});
    return nativeFileAccess.mergeFiles(prodFolder)
      .then((response) => this.setState({status: response.status, statusMessage: response.msg}));

  }

  render() {

    return (
      <Wrapper>
        <Switch>
          {/* sending through props to each rendered component because we need the history object to push next route/url onto history stack*/}
          <Route exact path="/" render={(props) => <InstallTypeSelect {...this.state} {...props} onChangeInstallType={this.changeInstallType} />} />
          {/*- Route for Installing OR Upgradig-- set folder locations  Setting component takes care of what to show for install versus upgrade -- -*/}
          <Route path="/(install|upgrade)/location"
            render={(props) => <Settings
              {...props}
              {...this.state}
              onStoreProductionFolder={this.storeProductionFolder}
              onStoreBackupFolder={this.storeBackupFolder}
            />}
          />
          {/*- Route for Installing -- allow user to perform install-- -*/}
          <Route path="/install/confirm"
            render={(props) => <InstallConfirm
              status={this.state.status}
              {...props}
              onInstallAnalytix={this.installAnalytix}
            />}
          />
          {/*- Route for Upgrade -- step param determines if we 'backup', 'copyfiles', 'mergefiles'-- -*/}
          <Route path="/upgrade/:step"
            render={(props) => <UpgradeSteps
              {...this.state}
              {...props}
              onCreateUpgradeBackup={this.createUpgradeBackup}
              onUpgradeAnalytixFiles={this.upgradeAnalytixFiles}
              onSetUpgradeStep={this.setUpgradeStep}
              onMergeFiles={this.mergeFiles}
            />}
          />
        </Switch>

        <StateDisplay {...this.state} />
      </Wrapper>
    );
  }
}

export default MainContainer;
