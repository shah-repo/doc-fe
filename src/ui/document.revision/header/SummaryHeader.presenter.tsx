import { Grid, LinearProgress } from '@material-ui/core';
import { useObserver } from 'mobx-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { SM } from '../../../App';
import { documentRevisionsSelectors } from '../../../state/ducks/documentRevisions';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../state/reducers';
import { AsyncStatus } from '../../../state/types';
import Header from '../../components/common/header/Header';
import HeaderInfo from '../../components/common/header/HeaderInfo';
import HeaderLastSaved from '../../components/common/header/HeaderLastSaved';
import { generateSubtitle } from '../../components/common/header/subtitles';
import { DOCUMENT_REVISION_CREATE_URL } from '../../constants/urls';
import { isFormWithInlineApproval } from '../../documentRevision/helpers/records';
import ControlsContainer from '../../documentRevision/PreviewControls.container';
import { getVersionNumber } from '../utils/helpers';
import useStyles from './FormHeader.styles';

interface Props {
  documentRevision: DocumentRevision
  canChangeOwnerShip?: boolean
  canShowCreateVersionButton?: boolean
  displayLastSaved: boolean
}

const SummaryHeaderPresenter: React.FunctionComponent<Props> = ({
  documentRevision,
  canChangeOwnerShip,
  canShowCreateVersionButton,
  displayLastSaved,
}) => {
  const asyncSecurityState = useSelector((state: ApplicationState) =>
    documentRevisionsSelectors.getLoadAsyncSecurityState(state));
  const isLoading = useObserver(() => (
    asyncSecurityState.status === AsyncStatus.Active
  ));
  const isCreateUrl = SM.pathname.includes(DOCUMENT_REVISION_CREATE_URL);
  const classes = useStyles(isCreateUrl);

  return (
    <Header
      displayStatus={documentRevision.displayStatus}
      status={documentRevision.status}
    >
      <HeaderInfo
        revisionStage={documentRevision.revisionStage}
        groupOptions={documentRevision.document.documentType.groupOptions}
        isInlineApproval={
          isFormWithInlineApproval(documentRevision.formDocument?.formTemplate?.schema)
        }
        status={documentRevision.status}
        id={documentRevision.document.docId}
        name={documentRevision.name}
        documentTypeId={documentRevision?.document?.documentType.id}
        revisionChangeType={documentRevision?.revisionChangeType}
        subRevision={documentRevision?.subRevision}
        displayStatus={documentRevision.displayStatus}
        subtitle={generateSubtitle(documentRevision)}
        displayRevision={getVersionNumber(documentRevision.id)}
        relatedParentPartDetails={documentRevision.relatedParentPartDetails}
      />
      <Grid item={true} xs={6}>
        <Grid container={true} alignItems="center" justify="flex-end">
          {displayLastSaved && documentRevision.updatedAt && (
            <HeaderLastSaved
              timestamp={documentRevision.updatedAt}
              loading={asyncSecurityState.status === AsyncStatus.Active}
            />
          )}
          <ControlsContainer
            documentRevision={documentRevision}
            canShowCreateVersionButton={canShowCreateVersionButton}
            hasAccess={documentRevision.document.canAccess}
            canChangeOwnerShip={canChangeOwnerShip || false}
          />
        </Grid>
      </Grid>
      {isLoading && <LinearProgress className={classes.linearProgress} data-cy="Document-Save-Progress-Bar" />}
    </Header>
  );
};
export default SummaryHeaderPresenter;
