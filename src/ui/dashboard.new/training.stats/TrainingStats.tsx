import { Box } from "@material-ui/core";
import React from "react";
import { TrainingStatusChartLabelTypes } from "../../../state/ducks/training/types";
import Data from "./data/chartData.json";
import TrainingLineItems from "./training.line.items/TrainingLineItems.container";
import { styles } from "./TrainingStats.styles";
import TrainingChart from "./tranining.chart/TrainingChart.container";

const trainingData = Data.trainingData.filter(
  (item) => item.status === TrainingStatusChartLabelTypes.OVERDUE || TrainingStatusChartLabelTypes.DUE_IN_7_DAYS
);
const TrainingStats: React.FunctionComponent = () => {
  const classes = styles();
  const [tabValue, setTabValue] = React.useState(0);
  const handleChildTabChange = (val: number) => {
    setTabValue(val);
  };
  return (
    <Box className={classes.outline}>
      <TrainingChart trainingData={trainingData} tabValue={tabValue} />
      <TrainingLineItems infoChangeTab={handleChildTabChange} trainingData={trainingData} />
    </Box>
  );
};

export default TrainingStats;
