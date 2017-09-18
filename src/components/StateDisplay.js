import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react';
import { SimpleWrapper } from './CommonStyled';

const StateDisplay = (props) => {
  const { productionFolder, backupFolder, type, status, statusMessage } = props;
  let formatType = type[0].toUpperCase() + type.slice(1);

  return (
    <SimpleWrapper maxWidth="600px" minWidth="300px">
      <Message>
        <Message.Header>Current Settings</Message.Header>
        <Message.List>
          {/*--Conditonal ERROR status message*/}
          {status === 'error' && <Message.Item><strong>ERROR: Contact Support
            <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
              {statusMessage}
            </div></strong>
          </Message.Item>}
          {/*--Type of operation install/upgrade message*/}
          <Message.Item><strong>{formatType} Analytix</strong></Message.Item>
          {/*--Conditional 'finsished' message for install/upgrade*/}
          {status === 'finished' && <Message.Item><strong>
            <div style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>
              {statusMessage}
            </div></strong>
          </Message.Item>}
          {/*--Coniditonal Production Folder message*/}
          {productionFolder && <Message.Item><strong>Production Folder:</strong>{productionFolder}</Message.Item>}
          {/*--Coniditonal Backup Folder message*/}
          {backupFolder && props.type === 'upgrade' && <Message.Item><strong>Backup Folder:</strong>{backupFolder}</Message.Item>}
        </Message.List>
      </Message>
    </SimpleWrapper>
  );
};

StateDisplay.propTypes = {
  productionFolder: PropTypes.string,
  backupFolder: PropTypes.string,
  type: PropTypes.string,
  status: PropTypes.string,
  statusMessage: PropTypes.string
};

export default StateDisplay;
