import React from "react";
import { useSelector } from "react-redux";
import { historyActions, historySelectors } from "../../../state/ducks/userManagement";
import AsyncGate from "../../components/AsyncGate";
import useActionCreator from "../../hooks/useActionCreator";
import AuditItemPresenter from "./presenter";

interface OwnProps {
  openHistoryPanel: boolean;
  closeHistoryPanel: (boolean) => void;
}

const AuditItemsContainer: React.FunctionComponent<OwnProps> = ({
  openHistoryPanel,
  closeHistoryPanel,
}) => {
  const loadHistoryList = useActionCreator(historyActions.loadHistoryList);
  const loadHistoryListAsyncInfo = useSelector(
    historySelectors.getLoadHistoryListAsyncInfo
  );

  return (
    <AsyncGate
      asyncAction={loadHistoryList}
      asyncState={loadHistoryListAsyncInfo}
      startActionOnMount={true}
    >
      <AuditItemPresenter openHistoryPanel={openHistoryPanel} closeHistoryPanel={closeHistoryPanel}/>
    </AsyncGate>
  );
};

export default AuditItemsContainer;
