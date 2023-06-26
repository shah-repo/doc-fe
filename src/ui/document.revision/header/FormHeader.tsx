import React from 'react';
import FormHeaderPresenter from './FormHeader.presenter';

interface Props {
  isCreateDocumentDisabled: boolean
  setDoNotPrompt?: (value: boolean) => void
}

const FormHeader: React.FunctionComponent<Props> = ({ isCreateDocumentDisabled, setDoNotPrompt }) => (
  <FormHeaderPresenter {...{ isCreateDocumentDisabled, setDoNotPrompt }} />
);

export default FormHeader;
