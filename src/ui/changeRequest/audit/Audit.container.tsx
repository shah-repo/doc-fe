import React, { useState } from "react";
import { connect } from "react-redux";
import { AuditGroupType } from "../../../state/ducks/audit/types";
import {
  changeRequestsActions,
  changeRequestsSelectors,
} from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import { AsyncState } from "../../../state/types";
import AsyncGate from "../../components/AsyncGate";
import AuditPresenter from "./Audit.presenter";

interface OwnProps {
  changeRequestId: string;
}

interface StateProps {
  audit: AuditGroupType;
  loadAuditAsyncState: AsyncState;
}

interface DispatchProps {
  loadAudit: typeof changeRequestsActions.loadAudit;
}

export type AuditContainerProps = OwnProps & StateProps & DispatchProps;

const getAudit = changeRequestsSelectors.makeGetAudit();
const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps,
): StateProps => ({
  loadAuditAsyncState: changeRequestsSelectors.getLoadAuditAsyncState(state),
  audit: getAudit(state, props.changeRequestId),
});

export const AuditContainer: React.FunctionComponent<AuditContainerProps> = ({
  audit,
  loadAudit,
  changeRequestId,
  loadAuditAsyncState,
}) => {
  const loadAuditAction = () => loadAudit(changeRequestId);
  useState(() => {
    loadAuditAction();
  });

  return <AuditPresenter audit={audit} />;
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadAudit: changeRequestsActions.loadAudit,
  },
)(AuditContainer);
