import React from 'react';
import FormHeaderPresenter from './FormHeader.presenter';

interface Props {
  isCreateDocumentDisabled: boolean
  setDoNotPrompt?: (value: boolean) => void
  isSliderView?: boolean
  inDialog?: boolean
}

const FormHeader: React.FunctionComponent<Props> = ({ isCreateDocumentDisabled, setDoNotPrompt, isSliderView, inDialog }) => (
  <FormHeaderPresenter {...{ isCreateDocumentDisabled, setDoNotPrompt, isSliderView, inDialog }} />
);

export default FormHeader;
