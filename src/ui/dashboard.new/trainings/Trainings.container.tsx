import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  dashboardMyFeedsActions,
} from "../../../state/ducks/dashboard.new/my.feeds";
import {
  trainingActions,
  trainingSelectors,
} from "../../../state/ducks/dashboard.new/training";
import AsyncGate from "../../components/AsyncGate";
import useActionCreator from "../../hooks/useActionCreator";
import useAsync from "../../hooks/useAsync";
import TrainingsLineItemPresenter from "./Trainings.presenter";

const TrainingsLineItemsContainer: React.FunctionComponent = () => {
  const loadTrainingList = useActionCreator(trainingActions.loadTrainingList);
  const loadTrainingListAsyncInfo = useSelector(
    trainingSelectors.getLoadTrainingListAsyncInfo
  );
  const dispatch = useDispatch();
  const pinnedOrUnPinnedAsync = useAsync({
    onSuccess: () => {
      dispatch(trainingActions.loadTrainingList());
    },
  });
  const pinnedLineItem = useActionCreator(dashboardMyFeedsActions.pinnedLineItem
  );
  const unPinnedLineItem = useActionCreator(dashboardMyFeedsActions.unPinnedLineItem
  );
  const pinLineItem = (id: string) => {
    pinnedOrUnPinnedAsync.start(pinnedLineItem, id, pinnedOrUnPinnedAsync);
  };
  const unPinLineItem = (pinnedItemId: string) => {
    pinnedOrUnPinnedAsync.start(unPinnedLineItem, pinnedItemId, pinnedOrUnPinnedAsync);
  };
  return (
    <>
      <AsyncGate
        asyncAction={loadTrainingList}
        asyncState={loadTrainingListAsyncInfo}
        startActionOnMount={true}
      >
        <TrainingsLineItemPresenter {...{ pinLineItem, unPinLineItem }}/>
      </AsyncGate>
    </>
  );
};

export default TrainingsLineItemsContainer;
