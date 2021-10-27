import { Box } from "@material-ui/core";
import React from "react";
import Data from "./data/chartData.json";
import TrainingLineItems from "./training.line.items/TrainingLineItems.container";
import { styles } from "./TrainingStats.styles";
import TrainingChart from "./tranining.chart/TrainingChart.container";

const trainingData: any[] = Data.trainingData;

const TrainingStats: React.FunctionComponent = () => {
  const classes = styles();
  return (
    <Box className={classes.outline}>
      <TrainingChart trainingData={trainingData} />
      <TrainingLineItems trainingData={trainingData} />
    </Box>
  );
};

export default TrainingStats;

