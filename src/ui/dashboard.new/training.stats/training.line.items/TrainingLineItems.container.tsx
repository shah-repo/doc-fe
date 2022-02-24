import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentDate, MomentFormats } from "../../../../common/utils/date";
import { trainingStatsActions, trainingStatsSelectors } from "../../../../state/ducks/dashboard.new/training.stats";
import { TRAINING_STATS_INITIAL_OFFSET, TRAINING_STATS_LIMIT } from "../../../../state/ducks/dashboard.new/training.stats/constants";
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
  const [offset, setOffset] = React.useState(TRAINING_STATS_INITIAL_OFFSET);
  const [overallLimit, setOverallLimit] = React.useState(TRAINING_STATS_LIMIT);
  const loadTrainingStatsList = useActionCreator(
    trainingStatsActions.loadTrainingStatsList
  );

  const loadTrainingStatsListAsyncInfo = useSelector(
    trainingStatsSelectors.getLoadTrainingStatsListAsyncInfo
  );

  // Create Payload on Tab Change
  const createTrainingLineItemsTabChangePayload = (tabValue: number) => {
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
    offset,
    limit: TRAINING_STATS_LIMIT,
    filters: createTrainingLineItemsTabChangePayload(tabValue),
  };

  useEffect(() => {
    dispatch(trainingStatsActions.trainingStatsList([]));
    setOffset(TRAINING_STATS_INITIAL_OFFSET);
    setOverallLimit(TRAINING_STATS_LIMIT);
    payload.offset = TRAINING_STATS_INITIAL_OFFSET;
    async.start(loadTrainingStatsList, payload);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabValue]);

  const onLoadMoreData = () => {
    const nextOffset = offset + TRAINING_STATS_LIMIT;
    setOffset(nextOffset);
    setOverallLimit(overallLimit + TRAINING_STATS_LIMIT);
    payload.offset = nextOffset;
    async.start(loadTrainingStatsList, payload);
  };

  return (<AsyncGate
    asyncAction={loadTrainingStatsList}
    asyncState={loadTrainingStatsListAsyncInfo}
    startActionOnMount={true}
  >
    <TrainingLineItemsPresenter tabValue={tabValue} overallLimit={overallLimit} onLoadMoreData={onLoadMoreData} />
  </AsyncGate>);
};

export default TrainingLineItems;
