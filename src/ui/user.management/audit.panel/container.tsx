import React from "react";
import AuditItemPresenter from "./presenter";

interface OwnProps {
  openHistoryPanel: boolean;
  closeHistoryPanel: () => void;
}

const AuditItemsContainer: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => (
  <>
    <AuditItemPresenter openHistoryPanel={openHistoryPanel} closeHistoryPanel={closeHistoryPanel}/>
  </>
);

export default AuditItemsContainer;
