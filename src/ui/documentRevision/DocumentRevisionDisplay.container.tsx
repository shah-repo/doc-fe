import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { AsyncState } from "../../state/types";
import AsyncGate from "../components/AsyncGate";
import SummaryPresenter from "../document.revision/summary/presenter";
import CloneContainer from "./Clone.container";
import DocumentRevisionUpdateContainer from "./DocumentRevisionUpdate.container";
import { canChangeDocumentOwner, canEditDocumentRevision } from "./helpers";

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
  isCompanyAdmin: authSelectors.getHasTag(state, GroupTag.OWNERSHIP_CHANGE),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentRevisionId]);

  const canChangeOwnerShip = useMemo(() => {
    if (!documentRevision) {
      return false;
    }
    return canChangeDocumentOwner(
      documentRevision.status,
      currentEmployeeId,
      documentRevision.owner.id,
      isCompanyAdmin,
    );
  }, [currentEmployeeId, documentRevision, isCompanyAdmin]);

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
