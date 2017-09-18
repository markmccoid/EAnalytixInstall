import React from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import styled  from 'styled-components';

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-around;
`;

const popupButton = (WrappedButton, popupMsg) => {
  return class PP extends React.Component {
    render() {
      if(popupMsg) {
        return (
          <Popup
            trigger={  <WrappedButton {...this.props} />}
            content={popupMsg}
          />
        );
      }
      return <WrappedButton {...this.props} />;
    }
  };
};

const ProgressButtons = (props) => {
  let { onNextClick, onPreviousClick, nextBtnDisabled, prevBtnDisabled } = props;
  let { prevToolTip, nextToolTip, customToolTip } = props.btnToolTips;
  //Create HOC button components
  let PrevButton = popupButton(Button, prevToolTip);
  let NextButton = popupButton(Button, nextToolTip);
  let CustomButton = popupButton(Button, customToolTip);

  return (
    <ButtonWrapper>
      <PrevButton primary
        className={props.showCustomBtn ? 'hide-element' : 'main-buttons'}
        disabled={prevBtnDisabled}
        onClick={() => onPreviousClick()}
        content='Previous'
      />

      <NextButton primary
        className={props.showCustomBtn ? 'hide-element' : 'main-buttons'}
        disabled={nextBtnDisabled}
        onClick={() => onNextClick()}
        content='Next'
      />;

      <CustomButton
        className={props.showCustomBtn ? 'main-buttons' : 'hide-element'}
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
  /*object with keys: prevToolTip, nextToolTip, customToolTip -- each value containing the tooltip for said button*/
  btnToolTips: PropTypes.object,
  /*if true, the previous and next buttons will be hidden and the custom button will be shown.*/
  showCustomBtn: PropTypes.bool,
  /*property object for a semantic ui Button component*/
  customBtnProperties: PropTypes.object,
  /*function called when custom button is pressed*/
  onCustomBtnClick: PropTypes.func
};

ProgressButtons.defaultProps = {
  btnToolTips: {
    prevToolTip: undefined,
    nextToolTip: undefined,
    customToolTip: undefined
  }
};

export default ProgressButtons;
