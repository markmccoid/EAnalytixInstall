import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'
import styled  from 'styled-components';

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: space-around;
`

const ProgressButtons = props => {
	let { onNextClick, onPreviousClick, nextBtnDisabled, prevBtnDisabled } = props;

console.log('buttons', props);
	return (
		<ButtonWrapper>
			<Button primary disabled={prevBtnDisabled}
				className="main-buttons"
				onClick={() => props.onPreviousClick()}>
				Previous
			</Button>
			<Button primary
				className="main-buttons"
				disabled={nextBtnDisabled}
				onClick={() => props.onNextClick()}>
				Next
			</Button>
		</ButtonWrapper>);
};

ProgressButtons.propTypes = {
	onPreviousClick: PropTypes.func,
	onNextClick: PropTypes.func,
	nextBtnDisabled: PropTypes.bool,
	prevBtnDisabled: PropTypes.bool
}

export default ProgressButtons;
//
// return (
// 	<ButtonWrapper>
// 		<Button primary disabled={currentStep === 1 ? true : false}
// 			className="main-buttons"
// 			onClick={() => onUpdateCurrentStep(currentStep - 1)}>
// 			Previous
// 		</Button>
// 		<Button primary
// 			className="main-buttons"
// 			disabled={nextBtnDisabledFlag}
// 			onClick={() => onUpdateCurrentStep(currentStep + 1)}>
// 			Next
// 		</Button>
// 	</ButtonWrapper>);
