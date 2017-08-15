import React from 'react';
import { Button } from 'semantic-ui-react'
import { Step } from 'semantic-ui-react'

const nativeFileAccess = window.require('../app/nativeFileAccess');
import Settings from './Settings';

const Main = () => {
	return (
		<div>
			This is the Main Component
			<Settings />
			<div>
				<Button primary onClick={()=> console.log(nativeFileAccess.getLocalPath('/analytix/qvw'))}>
					Click Here
				</Button>
			</div>



			<div>
				<Button circular icon='settings' />
			</div>
		</div>
	)
};

export default Main;

/*---Steps semantic ui code

const steps = [
  { completed: true, title: 'Backup Production', description: 'Backup Production Directory' },
  { completed: true, title: 'Update Production', description: 'Copy new files to production directory' },
  { active: true, title: 'Clean up', description: 'Clean up after ourselves' },
]

//-------------------
//--JSX
<div>
	<Step.Group ordered>
		<Step completed onClick={()=>console.log('clicked shipping')}>
			<Step.Content>
				<Step.Title>Shipping</Step.Title>
				<Step.Description>Choose your shipping options
					<Button primary size="mini">
						Click Here
					</Button>
				</Step.Description>

			</Step.Content>
		</Step>

		<Step completed title='Billing' description='Enter billing information' />

		<Step active title='Confirm Order' description='Verify order details' />
	</Step.Group>

	<br />

	<Step.Group ordered items={steps} />
</div>
*/
