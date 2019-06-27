import React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../../state/reducers";
import { changeRequestsActions, Audit, changeRequestsSelectors } from "../../../state/ducks/changeRequest";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import AuditPresenter from "./Audit.presenter";

interface OwnProps {
  documentRevisionId: string;
}

interface StateProps {
  audit: Audit[];
  loadAuditAsyncState: AsyncState;
}

interface DispatchProps {
  loadAudit: typeof changeRequestsActions.loadAudit;
}

export type AuditContainerProps = OwnProps & StateProps & DispatchProps;

const mapStateToProps = (state: ApplicationState, props: OwnProps): StateProps => ({
  loadAuditAsyncState: changeRequestsSelectors.getLoadAuditAsyncState(state),
  audit: changeRequestsSelectors.getAudit(state, props.documentRevisionId),
});

export const AuditContainer: React.FunctionComponent<AuditContainerProps> = ({
  audit, loadAudit, documentRevisionId, loadAuditAsyncState
}) => {
  const loadAuditAction = () => loadAudit(documentRevisionId);

  return (
    <AsyncGate asyncAction={loadAuditAction} asyncState={loadAuditAsyncState} startActionOnMount={true}>
      <AuditPresenter audit={audit} />
    </AsyncGate>
  );
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(mapStateToProps, {
  loadAudit: changeRequestsActions.loadAudit,
})(AuditContainer);
