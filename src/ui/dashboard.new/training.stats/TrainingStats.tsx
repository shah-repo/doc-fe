import { Box } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import {
  trainingStatsActions,
  trainingStatsSelectors,
} from "../../../state/ducks/dashboard.new/training.stats";
import AsyncGate from "../../components/AsyncGate";
import useActionCreator from "../../hooks/useActionCreator";
import TrainingChart from "./training.chart/TrainingChart.container";
import TrainingLineItems from "./training.line.items/TrainingLineItems.container";
import useStyles from "./TrainingStats.styles";

const TrainingStatsContainer: React.FunctionComponent = () => {
  const classes = useStyles();

  // Training Chart
  const loadTrainingStatsChart = useActionCreator(
    trainingStatsActions.loadTrainingStatsChart
  );

  const loadTrainingStatsChartAsyncInfo = useSelector(
    trainingStatsSelectors.getLoadTrainingStatsChartAsyncInfo
  );

  const [tabValue, setTabValue] = React.useState(0);
  const handleChildTabChange = (val: number) => {
    setTabValue(val);
  };
  return (
    <Box className={classes.root}>
      <Box className={classes.chart}>
        <AsyncGate
          asyncAction={loadTrainingStatsChart}
          asyncState={loadTrainingStatsChartAsyncInfo}
          startActionOnMount={true}>
          <TrainingChart tabValue={tabValue} infoChangeTab={handleChildTabChange} />
        </AsyncGate>
      </Box>
      <TrainingLineItems tabValue={tabValue} />
    </Box>
  );
};

export default TrainingStatsContainer;
