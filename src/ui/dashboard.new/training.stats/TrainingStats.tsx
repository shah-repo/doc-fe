import { Box } from "@material-ui/core";
import React from "react";
import { TrainingStatusChartLabelTypes } from "../../../state/ducks/training/types";
import Data from "./data/chartData.json";
import trainingStatsData from "./data/TrainingStatistics.json";
import TrainingLineItems from "./training.line.items/TrainingLineItems.container";
import { styles } from "./TrainingStats.styles";
import TrainingChart from "./tranining.chart/TrainingChart.container";

const trainingData = trainingStatsData.filter(
  (item) =>
    item.status === TrainingStatusChartLabelTypes.OVERDUE ||
    item.status === TrainingStatusChartLabelTypes.DUE
);
const trainingLineItemsData = Data.trainingData.filter(
  (item) =>
    item.status === TrainingStatusChartLabelTypes.OVERDUE ||
  item.status === TrainingStatusChartLabelTypes.DUE
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
      <TrainingLineItems
        infoChangeTab={handleChildTabChange}
        trainingData={trainingLineItemsData}
      />
    </Box>
  );
};

export default TrainingStats;
