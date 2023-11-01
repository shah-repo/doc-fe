import React from 'react';
import FormHeaderPresenter from './FormHeader.presenter';

interface Props {
  isCreateDocumentDisabled: boolean
  setDoNotPrompt?: (value: boolean) => void
  isSliderView?: boolean
}

const FormHeader: React.FunctionComponent<Props> = ({ isCreateDocumentDisabled, setDoNotPrompt, isSliderView }) => (
  <FormHeaderPresenter {...{ isCreateDocumentDisabled, setDoNotPrompt, isSliderView }} />
);

export default FormHeader;
