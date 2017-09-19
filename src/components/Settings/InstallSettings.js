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

const InstallSettings = (props) => {
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
    </Wrapper>
  );
};

InstallSettings.propTypes = {
  productionFolder: PropTypes.string,
  onSelectProductionFolder: PropTypes.func,
  onManualProductionFolder: PropTypes.func
};
export default InstallSettings;
