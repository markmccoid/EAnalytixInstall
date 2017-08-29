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

	return (
		<ButtonWrapper>
			<Button primary disabled={prevBtnDisabled}
				className={props.showCustomBtn ? "hide-element" : "main-buttons"}
				onClick={() => props.onPreviousClick()}>
				Previous
			</Button>
			<Button primary
				className={props.showCustomBtn ? "hide-element" : "main-buttons"}
				disabled={nextBtnDisabled}
				onClick={() => props.onNextClick()}>
				Next
			</Button>
			<Button
				className={props.showCustomBtn ? "main-buttons" : "hide-element"}
				onClick={() => props.onCustomBtnClick()}
				{...props.customBtnProperties}
			/>

		</ButtonWrapper>
	);
};

ProgressButtons.propTypes = {
	/*function called when previous button is pressed*/
	onPreviousClick: PropTypes.func,
	/*function called when next button is pressed*/
	onNextClick: PropTypes.func,
	/*disables next button if true*/
	nextBtnDisabled: PropTypes.bool,
	/*disables previous button if true*/
	prevBtnDisabled: PropTypes.bool,
	/*if true, the previous and next buttons will be hidden and the custom button will be shown.*/
	showCustomBtn: PropTypes.bool,
	/*property object for a semantic ui Button component*/
	customBtnProperties: PropTypes.object,
	/*function called when custom button is pressed*/
	onCustomBtnClick: PropTypes.func
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
