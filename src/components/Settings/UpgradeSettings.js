import React from 'react';
import PropTypes from 'prop-types';
import styled  from 'styled-components';
import { Input } from 'semantic-ui-react';
import { Header } from '../CommonStyled';

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	margin: 10px;
`;

const UpgradeSettings = (props) => {
  return (
    <Wrapper>
      <Header textAlign="left">Select location of Analytix production directory</Header>
      <Input
        size="small my-input-size"
        icon={{ name: 'folder open outline', circular: true, link: true, onClick: props.onSelectProductionFolder}}
        placeholder='Choose Production Folder...'
        value={props.productionFolder}
        onChange={(e, data) => props.onManualProductionFolder(data.value)}
      />
      <br />
      <Header textAlign="left">Select backup directory or accept suggested directory</Header>
      <Input
        size="small my-input-size"
        icon={{ name: 'folder open outline', circular: true, link: true, onClick: props.onSelectBackupFolder}}
        placeholder='Choose Backup Folder...'
        value={props.backupFolder}
        onChange={(e, data) => props.onManualBackupFolder(data.value)}
      />
    </Wrapper>
  );
};

UpgradeSettings.propTypes = {
  onSelectProductionFolder: PropTypes.func,
  onSelectBackupFolder: PropTypes.func,
  onSetUpgradeStep: PropTypes.func,
  currUpgradeStep: PropTypes.string //'backup', 'copyfiles',
};

export default UpgradeSettings;
