import React from 'react';
import { Message } from 'semantic-ui-react'

const StateDisplay = props => {
	const { productionFolder, backupFolder, type, currentStep } = props;
	let formatType = type[0].toUpperCase() + type.slice(1);
	console.log(formatType);
	return (
		<Message>
	    <Message.Header>Current Settings</Message.Header>
	    <Message.List>
	      <Message.Item><strong>{formatType} Analytix</strong></Message.Item>
	      {productionFolder && <Message.Item><strong>Production Folder:</strong>{productionFolder}</Message.Item>}
				{backupFolder && <Message.Item><strong>Backup Folder:</strong>{backupFolder}</Message.Item>}
	    </Message.List>
	  </Message>
	)
};

export default StateDisplay;
