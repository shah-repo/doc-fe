import React from "react";
import { useSelector } from "react-redux";
import { trainingStatsSelectors } from "../../../../state/ducks/dashboard.new/training.stats";
import TrainingChartPresenter from "./TrainingChart.presenter";

interface TrainingChartProps {
  tabValue: number;
  infoChangeTab: (newValue: number) => void;
}

const TrainingChart: React.FunctionComponent<TrainingChartProps> = ({
  tabValue,
  infoChangeTab,
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
      infoChangeTab={infoChangeTab}
    />
  );
};

export default TrainingChart;
