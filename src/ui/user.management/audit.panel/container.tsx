import React from "react";
import AuditItemPresenter from "./presenter";

interface Props {
  openHistoryPanel: boolean;
  closeHistoryPanel: () => void;
  queryURL: string;
}

const AuditItemsContainer: React.FunctionComponent<Props> = ({
  openHistoryPanel,
  closeHistoryPanel,
  queryURL,
}) => <AuditItemPresenter openHistoryPanel={openHistoryPanel}
  closeHistoryPanel={closeHistoryPanel} queryURL={queryURL}/>;

export default AuditItemsContainer;
