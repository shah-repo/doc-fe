import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getCurrentDate, MomentFormats } from "../../../../common/utils/date";
import { trainingStatsActions, trainingStatsSelectors } from "../../../../state/ducks/dashboard.new/training.stats";
import AsyncGate from "../../../components/AsyncGate";
import useActionCreator from "../../../hooks/useActionCreator";
import useAsync from "../../../hooks/useAsync";
import TrainingLineItemsPresenter from "./TrainingLineItems.presenter";

interface TrainingLineItemsProps {
  tabValue: number;
}

const TrainingLineItems: React.FunctionComponent<TrainingLineItemsProps> = ({
  tabValue,
}) => {
  const async = useAsync();
  const loadTrainingStatsList = useActionCreator(
    trainingStatsActions.loadTrainingStatsList
  );

  const loadTrainingStatsListAsyncInfo = useSelector(
    trainingStatsSelectors.getLoadTrainingStatsListAsyncInfo
  );

  // Create Payload on click
  const createTrainingLineItemsnTabPayload = (tabValue: number) => {
    const currentDate = getCurrentDate(MomentFormats.YearMonthDate);
    const filters = {
      field: "dueOn",
      operator: "",
      value: currentDate,
    };
    switch (tabValue) {
      case 1:
        filters.operator = "lt";
        return [filters];
      case 2:
        filters.operator = "gte";
        return [filters];
      default:
        return [];
    }
  };

  useEffect(() => {
    const payload = {
      filters: createTrainingLineItemsnTabPayload(tabValue),
    };
    async.start(loadTrainingStatsList, payload);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  return (<AsyncGate
    asyncAction={loadTrainingStatsList}
    asyncState={loadTrainingStatsListAsyncInfo}
    startActionOnMount={true}
  >
    <TrainingLineItemsPresenter tabValue={tabValue} />
  </AsyncGate>);
};

export default TrainingLineItems;
