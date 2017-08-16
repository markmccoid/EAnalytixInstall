import React from 'react';
import { Button } from 'semantic-ui-react'
import styled  from 'styled-components';

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: space-around;
`

const ProgressButtons = props => {
	let { currentStep, onUpdateCurrentStep } = props;
	let nextBtnDisabledFlag = props.type === 'install' && currentStep === 3 ? true : false;
	return (
		<ButtonWrapper>
			<Button primary disabled={currentStep === 1 ? true : false}
				className="main-buttons"
				onClick={() => onUpdateCurrentStep(currentStep - 1)}>
				Previous
			</Button>
			<Button primary
				className="main-buttons"
				disabled={nextBtnDisabledFlag}
				onClick={() => onUpdateCurrentStep(currentStep + 1)}>
				Next
			</Button>
		</ButtonWrapper>);
};

export default ProgressButtons;
