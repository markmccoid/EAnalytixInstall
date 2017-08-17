import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react'
import { SimpleWrapper } from './CommonStyled';

const StateDisplay = props => {
	const { productionFolder, backupFolder, type, currentStep, status, statusMessage } = props;
	let formatType = type[0].toUpperCase() + type.slice(1);
	// console.log(statusMessage);
	// for (var name in statusMessage) {
  // 	console.log('statusMessage Property', name);
	// }
	return (
		<SimpleWrapper width="600px">
		<Message>
	    <Message.Header>Current Settings</Message.Header>
	    <Message.List>
				{status === 'error' && <Message.Item><strong>ERROR: Contact Support
					<div style={{wordWrap: "break-word", wordBreak: "break-word"}}>
						{statusMessage}
					</div></strong>
				</Message.Item>}
	      <Message.Item><strong>{formatType} Analytix</strong></Message.Item>
	      {productionFolder && <Message.Item><strong>Production Folder:</strong>{productionFolder}</Message.Item>}
				{backupFolder && props.type === 'upgrade' && <Message.Item><strong>Backup Folder:</strong>{backupFolder}</Message.Item>}
	    </Message.List>
	  </Message>
	</SimpleWrapper>
	)
};

StateDisplay.propTypes = {
	productionFolder: PropTypes.string,
	backupFolder: PropTypes.string,
	type: PropTypes.string,
	status: PropTypes.string,
	statusMessage: PropTypes.string
}

export default StateDisplay;
