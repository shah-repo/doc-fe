import React from "react";
import { TrainingStatusChartLabelTypes } from "../../../../state/ducks/training/types";
import TrainingChartPresenter from "./TrainingChart.presenter";

interface TrainingChartProps {
  trainingData: any[];
  tabValue: number;
}

const TrainingChart: React.FunctionComponent<TrainingChartProps> = ({
  trainingData,
  tabValue,
}) => {
  // TO DO: Logic for count calculation needs to be updated based on actual data
  const overdue = trainingData.filter(
    (item) => item.status === TrainingStatusChartLabelTypes.OVERDUE
  ).length;
  const dueInSeven = trainingData.filter(
    (item) => item.status ===  TrainingStatusChartLabelTypes.DUE
  ).length;
  return <TrainingChartPresenter tabValue={tabValue} overdue={overdue} dueInSeven={dueInSeven} />;
};

export default TrainingChart;
