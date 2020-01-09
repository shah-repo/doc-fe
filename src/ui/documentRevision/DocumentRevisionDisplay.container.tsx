import React, { useEffect } from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
  DocumentRevisionStatus,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import SummaryPresenter from "../document.revision/summary/presenter";
import CloneContainer from "./Clone.container";
import DocumentRevisionUpdateContainer from "./DocumentRevisionUpdate.container";
import { canEditDocumentRevision } from "./helpers";

interface StateProps {
  currentUserEmail: string;
  loadDocumentRevisionAsyncState: AsyncState;
  documentRevision: DocumentRevision;
  currentEmployeeId: string;
  isCompanyAdmin: boolean;

}

interface DispatchProps {
  loadDocumentRevision: typeof documentRevisionsActions.load;
}

interface OwnProps {
  documentId: string;
  documentRevisionId: string;
  isNewVersion?: boolean;
  isNewOutput?: boolean;
}

export type DocumentRevisionDisplayContainerProps = OwnProps &
  DispatchProps &
  StateProps;

const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps,
): StateProps => ({
  currentUserEmail: authSelectors.currentUserEmail(state),
  loadDocumentRevisionAsyncState: documentRevisionsSelectors.getLoadAsyncState(
    state,
  ),
    isCompanyAdmin: authSelectors.getHasTag(state, GroupTag.COMPANY_ADMIN),
    currentEmployeeId: authSelectors.currentEmployeeId(state),
  documentRevision: documentRevisionsSelectors.getDocumentRevision(
    state,
    props.documentRevisionId,
  ),
});

export const DocumentRevisionDisplayContainer: React.FunctionComponent<
  DocumentRevisionDisplayContainerProps
> = ({
  currentUserEmail,
  loadDocumentRevision,
  isNewVersion,
  isNewOutput,
  documentRevisionId,
  documentRevision,
  loadDocumentRevisionAsyncState,
  documentId,
  currentEmployeeId,
  isCompanyAdmin,
}) => {
  const loadDocumentRevisionAction = () =>
    loadDocumentRevision(documentRevisionId);

  useEffect(() => {
    if (documentRevisionId) {
      loadDocumentRevisionAction();
    }
  }, [documentRevisionId]);

  const canChangeOwnerShip =
  documentRevision &&
  documentRevision.status === DocumentRevisionStatus.Draft &&
    (isCompanyAdmin ||
      documentRevision.owner.id === currentEmployeeId);

  const canEdit =
    documentRevision &&
    !isNewVersion &&
    !isNewOutput &&
    canEditDocumentRevision(documentRevision, currentUserEmail);

  const canPreview =
    documentRevision && !(canEdit || isNewVersion || isNewOutput);

  return (
    <AsyncGate
      asyncState={loadDocumentRevisionAsyncState}
      asyncAction={loadDocumentRevisionAction}
      startActionOnMount={false}
    >
      {canEdit && (
        <DocumentRevisionUpdateContainer
          documentRevision={documentRevision}
          documentId={documentId}
          canChangeOwnerShip={canChangeOwnerShip}
        />
      )}
      {canPreview && (
        <SummaryPresenter
          dataProp={documentRevision}
          canChangeOwnerShip={canChangeOwnerShip}
          canShowCreateVersionButton={true}
        />
      )}
      {isNewVersion && (
        <CloneContainer documentRevision={documentRevision} type="newVersion" />
      )}
      {isNewOutput && (
        <CloneContainer documentRevision={documentRevision} type="newOutput" />
      )}
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadDocumentRevision: documentRevisionsActions.load,
  },
)(DocumentRevisionDisplayContainer);
