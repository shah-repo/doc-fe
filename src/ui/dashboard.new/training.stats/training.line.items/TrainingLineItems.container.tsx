import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentDate, MomentFormats } from "../../../../common/utils/date";
import { trainingStatsActions, trainingStatsSelectors } from "../../../../state/ducks/dashboard.new/training.stats";
import { TRAINING_STAT_LIMIT, TRAINING_STAT_OFFSET } from "../../../../state/ducks/dashboard.new/training.stats/constants";
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
  const dispatch = useDispatch();
  const async = useAsync();
  const loadTrainingStatsList = useActionCreator(
    trainingStatsActions.loadTrainingStatsList
  );

  const loadTrainingStatsListAsyncInfo = useSelector(
    trainingStatsSelectors.getLoadTrainingStatsListAsyncInfo
  );

  const trainingStatPageInfo = useSelector(trainingStatsSelectors.trainingStatPageInfo);
  // Create Payload on click
  const createTrainingLineItemsonTabChangePayload = (tabValue: number) => {
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
  const payload = {
    offset: TRAINING_STAT_OFFSET,
    limit: TRAINING_STAT_LIMIT,
    filters: createTrainingLineItemsonTabChangePayload(tabValue),
  };
  const updatedPageSize = {
    offset: payload.offset,
    limit: payload.limit,
  };

  useEffect(() => {
    async.start(loadTrainingStatsList, payload);
    dispatch(trainingStatsActions.trainingStatPageInfo(updatedPageSize));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  const onLoadMoreData = () => {
    payload.offset = trainingStatPageInfo.offset + TRAINING_STAT_LIMIT;
    payload.limit = trainingStatPageInfo.limit + TRAINING_STAT_LIMIT;
    updatedPageSize.offset = payload.offset;
    updatedPageSize.limit =  payload.limit;
    async.start(loadTrainingStatsList, payload);
    dispatch(trainingStatsActions.trainingStatPageInfo(updatedPageSize));
  };

  return (<AsyncGate
    asyncAction={loadTrainingStatsList}
    asyncState={loadTrainingStatsListAsyncInfo}
    startActionOnMount={true}
  >
    <TrainingLineItemsPresenter tabValue={tabValue} onLoadMoreData={onLoadMoreData} />
  </AsyncGate>);
};

export default TrainingLineItems;
