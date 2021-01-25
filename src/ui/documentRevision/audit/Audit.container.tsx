import React, { useEffect } from "react";
import { connect } from "react-redux";
import { AuditGroupType } from "../../../state/ducks/audit/types";
import {
  DocumentRevision,
  documentRevisionsActions,
  documentRevisionsSelectors,
} from "../../../state/ducks/documentRevisions";
import { ApplicationState } from "../../../state/reducers";
import CustomLabelTooltip from "../../hooks/docCustomization/CustomLabelTooltip";
import { useDocumentStatus } from "../../hooks/docCustomization/useCustomization";
import AuditPresenter from "./Audit.presenter";

interface OwnProps {
  documentRevisionId: string;
  documentTypeId: string;
  selectedDocument: DocumentRevision;
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
  documentTypeId,
  selectedDocument,
}) => {
  useEffect(() => {
    if (documentRevisionId) {
      loadAudit(documentRevisionId);
    }
  }, [documentRevisionId, loadAudit]);

  const {
    isVisible: isStatusVisible,
    label: statusLabel,
    tooltipConfig,
  } = useDocumentStatus(documentTypeId, selectedDocument?.status);
  const versionNumber = selectedDocument.displayRevision;

  return  <CustomLabelTooltip {...{ tooltipConfig }}>
    <AuditPresenter {...{ audit, versionNumber, isStatusVisible }} statusLabel={statusLabel as string}/>
  </CustomLabelTooltip>;
};

export default connect<StateProps, DispatchProps, OwnProps, ApplicationState>(
  mapStateToProps,
  {
    loadAudit: documentRevisionsActions.loadAudit,
  },
)(AuditContainer);
