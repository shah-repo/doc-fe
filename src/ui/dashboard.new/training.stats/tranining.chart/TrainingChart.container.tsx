import React from "react";
import TrainingChartPresenter from "./TrainingChart.presenter";

// import { styles } from "./TrainingChart.styles";

interface TrainingChartProps {
  trainingData: any[];
}

function TrainingChart(props: TrainingChartProps) {
  const { trainingData } = props;
  // const classes = styles();
  // TO DO: Logic for count calculation needs to be updated based on actual data
  const overdue = trainingData.filter((item) => item.status === "OVERDUE").length;
  const dueInSeven = trainingData.filter((item) => item.status === "DUE IN 7 DAYS").length;
  return (
    <TrainingChartPresenter overdue={overdue} dueInSeven={dueInSeven}/>
  );
}

export default TrainingChart;
