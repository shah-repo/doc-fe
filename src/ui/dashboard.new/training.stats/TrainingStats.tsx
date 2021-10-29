import { Box } from "@material-ui/core";
import { pick } from "lodash";
import React from "react";
import { TrainingStatusChartLabelTypes } from "../../../state/ducks/training/types";
import trainingStatsData from "./data/TrainingStatistics.json";
import TrainingLineItems from "./training.line.items/TrainingLineItems.container";
import { styles } from "./TrainingStats.styles";
import TrainingChart from "./tranining.chart/TrainingChart.container";

const TrainingStats: React.FunctionComponent = () => {
  const classes = styles();
  const [tabValue, setTabValue] = React.useState(0);
  const handleChildTabChange = (val: number) => {
    setTabValue(val);
  };
  const trainingData = trainingStatsData.filter((item) => {
    pick(item.user, ["name", "avatar"]);
    return (
      item.status === TrainingStatusChartLabelTypes.OVERDUE ||
      item.status === TrainingStatusChartLabelTypes.DUE
    );
  });
  return (
    <Box className={classes.outline}>
      <TrainingChart trainingData={trainingData} tabValue={tabValue} />
      <TrainingLineItems
        infoChangeTab={handleChildTabChange}
        trainingData={trainingData}
      />
    </Box>
  );
};

export default TrainingStats;
