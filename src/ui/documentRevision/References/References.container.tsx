import React from 'react';
import ReferencesPresenter from './References.presenter';
import { ReferencesProps } from './types';

const ReferencesContainer = ({
  selectedDocument,
  edit,
}: ReferencesProps) => (
  <ReferencesPresenter
    selectedDocument={selectedDocument}
    edit={edit}
  />
);

export default ReferencesContainer;
