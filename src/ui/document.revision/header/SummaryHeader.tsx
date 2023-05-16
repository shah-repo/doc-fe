import React from 'react';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { statesWithLastSavedEnabled } from '../utils/helpers';
import SummaryHeaderPresenter from './SummaryHeader.presenter';

interface Props {
  documentRevision: DocumentRevision;
  canChangeOwnerShip?: boolean;
  canShowCreateVersionButton?: boolean;
  displayLastSaved?: boolean;
}
export interface FormHeaderSummaryContext {
  documentRevisionSummary: DocumentRevision;
}
export let FormHeaderSummaryContext = React.createContext<FormHeaderSummaryContext | undefined>(undefined);

const SummaryHeader: React.FunctionComponent<Props> = ({
  documentRevision,
  canChangeOwnerShip,
  canShowCreateVersionButton,
}) => {
  FormHeaderSummaryContext = React.createContext<FormHeaderSummaryContext | undefined>({
    documentRevisionSummary: documentRevision,
  });
  const displayLastSaved = statesWithLastSavedEnabled.includes(documentRevision.status);

  return (
    <SummaryHeaderPresenter
      {...{
        documentRevision,
        canChangeOwnerShip,
        canShowCreateVersionButton,
        displayLastSaved,
      }}
    />
  );
};

export default SummaryHeader;
