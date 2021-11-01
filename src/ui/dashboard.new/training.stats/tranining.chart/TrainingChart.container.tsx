import React from "react";
import TrainingChartPresenter from "./TrainingChart.presenter";
import { useSelector } from "react-redux";
import { trainingStatsSelectors } from "../../../../state/ducks/dashboard.new/trainingStats";

interface TrainingChartProps {
  tabValue: number;
}

const TrainingChart: React.FunctionComponent<TrainingChartProps> = ({
  tabValue,
}) => {
  const overdueTrainingData = useSelector(
    trainingStatsSelectors.overdueTrainingData
  );
  const dueTrainingData = useSelector(trainingStatsSelectors.dueTrainingData);
  return (
    <TrainingChartPresenter
      tabValue={tabValue}
      overdue={overdueTrainingData?.length || 0}
      dueInSeven={dueTrainingData?.length || 0}
    />
  );
};

export default TrainingChart;
