import React from "react";
import { TrainingStatusChartLabelTypes } from "../../../../state/ducks/training/types";
import TrainingChartPresenter from "./TrainingChart.presenter";

interface TrainingChartProps {
  trainingData: any[];
}

const TrainingChart: React.FunctionComponent<TrainingChartProps> = ({
  trainingData,
}) => {
  // TO DO: Logic for count calculation needs to be updated based on actual data
  const overdue = trainingData.filter(
    (item) => TrainingStatusChartLabelTypes.OVERDUE
  ).length;
  const dueInSeven = trainingData.filter(
    (item) => TrainingStatusChartLabelTypes.DUE_IN_7_DAYS
  ).length;
  return <TrainingChartPresenter overdue={overdue} dueInSeven={dueInSeven} />;
};

export default TrainingChart;
