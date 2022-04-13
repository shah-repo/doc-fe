import React from "react";
import AuditItemPresenter from "./presenter";

interface Props {
  openHistoryPanel: boolean;
  closeHistoryPanel: () => void;
}

const AuditItemsContainer: React.FunctionComponent<Props> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => <AuditItemPresenter openHistoryPanel={openHistoryPanel} closeHistoryPanel={closeHistoryPanel}/>;

export default AuditItemsContainer;
