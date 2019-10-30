import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AuditGroupType } from "../../../state/ducks/audit/types";
import {
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import AuditPresenter from "./Audit.presenter";

interface OwnProps {
  documentRevisionId: string;
}

interface StateProps {
  audit: AuditGroupType;
}

interface DispatchProps {
  loadAudit: typeof documentRevisionsActions.loadAudit;
}

export type AuditContainerProps = OwnProps & StateProps & DispatchProps;

const getAudit = documentRevisionsSelectors.makeGetAudit();

const mapStateToProps = (
  state: ApplicationState,
  props: OwnProps,
): StateProps => ({
  audit: getAudit(state, props.documentRevisionId),
});

export const AuditContainer: React.FunctionComponent<AuditContainerProps> = ({
  audit,
  loadAudit,
  documentRevisionId,
}) => {
  const loadAuditAction = () => loadAudit(documentRevisionId);
  useEffect(() => {
    if (documentRevisionId) {
      loadAuditAction();
    }
  }, [documentRevisionId]);

  return <AuditPresenter audit={audit} />;
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadAudit: documentRevisionsActions.loadAudit,
  },
)(AuditContainer);
