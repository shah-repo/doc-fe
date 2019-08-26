import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  AuditGroupType,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import AuditPresenter from "./Audit.presenter";

interface OwnProps {
  documentRevisionId: string;
}

interface StateProps {
  audit: AuditGroupType;
  loadAuditAsyncState: AsyncState;
}

interface DispatchProps {
  loadAudit: typeof documentRevisionsActions.loadAudit;
}

export type AuditContainerProps = OwnProps & StateProps & DispatchProps;

const getAudit = documentRevisionsSelectors.makeGetAudit();

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadAuditAsyncState: documentRevisionsSelectors.getLoadAuditAsyncState(state),
  audit: getAudit(state, props.documentRevisionId),
});

export const AuditContainer: React.FunctionComponent<AuditContainerProps> = ({
  audit, loadAudit, documentRevisionId, loadAuditAsyncState,
}) => {
  const loadAuditAction = () => loadAudit(documentRevisionId);
  useEffect(() => {
    if (documentRevisionId) {
      loadAuditAction();
    }
  }, [documentRevisionId]);

  return (
    <AsyncGate asyncAction={loadAuditAction} asyncState={loadAuditAsyncState} startActionOnMount={false}>
      <AuditPresenter audit={audit} />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadAudit: documentRevisionsActions.loadAudit,
})(AuditContainer);
