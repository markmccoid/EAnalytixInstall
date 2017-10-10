import React from 'react';
import PropTypes from 'prop-types';
import styled  from 'styled-components';
import { Step } from 'semantic-ui-react';
const { remote } = require('electron');

import ProgressButtons from '../ProgressButtons';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 10px;
`;

const UpgradeSteps = (props) => {
  let currStep = props.match.params.step;
  let btnPrevious = () => props.history.push('/upgrade/location');
  let btnNext, btnCustom;
  let btnToolTips = {};
  //These properties will be used to show the finished screen.
  let showFinishedBtn = false;
  let finishedBtnProperties = {};

  switch (currStep) {
    case 'backup':
      //create the function to be called when the next button is pressed
      btnNext = () => {
        props.onCreateUpgradeBackup(props.productionFolder, props.backupFolder)
          .then(() => {
            console.log('pushing /upgrade/copyfiles/');
            props.history.push('/upgrade/copyfiles');
          });
      };
      //Add a tool tip for the next Button
      btnToolTips.nextToolTip = 'Create Backup';
      break;
    case 'copyfiles':
      btnNext = () => {
        props.onUpgradeAnalytixFiles(props.productionFolder, props.backupFolder)
          .then(() => {
            console.log('pushing /upgrade/mergefiles/');
            props.history.push('/upgrade/mergefiles');
          });
      };
      btnToolTips.nextToolTip = 'Copy Upgrade Files';
      break;
    case 'mergefiles':
      btnNext = () => {
        props.onMergeFiles(props.productionFolder)
          .then(() => {
            console.log('pushing /upgrade/finished');
            props.history.push('/upgrade/finished');
          });
      };
      btnToolTips.nextToolTip = 'Merge qvVariables and qvGroups Files';
      break;
    case 'finished':
      btnCustom = () => remote.app.quit();
      showFinishedBtn = true;
      finishedBtnProperties = {content: 'Exit', positive: true};
      btnToolTips.customToolTip = 'Analytix Upgraded...Exit';
      break;
    default:
      btnNext = () => alert('ERROR');
  }

  return (
    <Wrapper>
      <h1 style={{textAlign: 'center'}}>Press Next to continue with Upgrade</h1>
      <Step.Group>
        {/*STEP 1 - Create Backup*/}
        <Step
          icon={props.status==='working' && currStep === 'backup' ? 'loading spinner' : 'file'}
          completed={currStep !== 'backup'}
          active={currStep === 'backup'}
          title='Backup'
          description='Backup Production Files'
        />
        {/*STEP 2 - Copy Upgrade Files*/}
        <Step
          icon={props.status === 'working' && currStep === 'copyfiles' ? 'loading spinner' : 'copy'}
          completed={currStep !== 'copyfiles' && currStep !=='backup'}
          active={currStep === 'copyfiles'}
          title='Copy'
          description='Copy Upgrade Files'
        />

        {/*STEP 3 - Merge Variable File*/}
        <Step
          icon={props.status === 'working' && currStep === 'mergefiles' ? 'loading spinner' : 'translate'}
          completed={currStep !== 'copyfiles' && currStep !=='backup' && currStep !== 'mergefiles'}
          active={currStep === 'mergefiles'}
          title='Merge'
          description='Merging Variable and Group Files'
        />
      </Step.Group>
      <br />
      <ProgressButtons
        onPreviousClick={btnPrevious}
        onNextClick={btnNext}
        btnToolTips={btnToolTips}
        showCustomBtn={showFinishedBtn}
        customBtnProperties={finishedBtnProperties}
        onCustomBtnClick={btnCustom}
      />
    </Wrapper>
  );
};

UpgradeSteps.propTypes = {
  onCreateUpgradeBackup: PropTypes.func,
  onMergeFiles: PropTypes.func
};

export default UpgradeSteps;
