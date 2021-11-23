import React from "react";
import { useSelector } from "react-redux";
import {
  trainingActions,
  trainingSelectors,
} from "../../../state/ducks/dashboard.new/training";
import AsyncGate from "../../components/AsyncGate";
import useActionCreator from "../../hooks/useActionCreator";
import TrainingsLineItemPresenter from "./Trainings.presenter";

const TrainingsLineItemsContainer: React.FunctionComponent = () => {
  const loadTrainingList = useActionCreator(trainingActions.loadTrainingList);
  const loadTrainingListAsyncInfo = useSelector(
    trainingSelectors.getLoadTrainingListAsyncInfo
  );
  return (
    <AsyncGate
      asyncAction={loadTrainingList}
      asyncState={loadTrainingListAsyncInfo}
      startActionOnMount={true}
    >
      <TrainingsLineItemPresenter />
    </AsyncGate>
  );
};

export default TrainingsLineItemsContainer;
