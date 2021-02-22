import React, { useState } from "react";
import { connect } from "react-redux";
import { AuditGroupType } from "../../../state/ducks/audit/types";
import {
  ChangeRequest,
  changeRequestsActions,
  changeRequestsSelectors,
} from "../../../state/ducks/changeRequest";
import { ApplicationState } from "../../../state/reducers";
import AuditPresenter from "./Audit.presenter";

interface Props {
  changeRequest: ChangeRequest;
}

type OwnProps = Props;

interface StateProps {
  audit: AuditGroupType;
}

interface DispatchProps {
  loadAudit: typeof changeRequestsActions.loadAudit;
}

type AuditContainerProps = OwnProps & StateProps & DispatchProps;

const getAudit = changeRequestsSelectors.makeGetAudit();
const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps,
): StateProps => ({
  audit: getAudit(state, props.changeRequest.id),
});

const AuditContainer: React.FunctionComponent<AuditContainerProps> = ({
  audit,
  loadAudit,
  changeRequest,
}) => {
  const loadAuditAction = () => loadAudit(changeRequest.id);
  useState(() => {
    loadAuditAction();
  });

  return <AuditPresenter approvals={changeRequest.approvals} audit={audit} />;
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadAudit: changeRequestsActions.loadAudit,
  },
)(AuditContainer);
