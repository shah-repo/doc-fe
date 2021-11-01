import { Box } from "@material-ui/core";
import React from "react";
// import trainingStatsData from "./data/TrainingStatistics.json";
import TrainingLineItems from "./training.line.items/TrainingLineItems.container";
import { styles } from "./TrainingStats.styles";
import TrainingChart from "./tranining.chart/TrainingChart.container";
import { useSelector } from "react-redux";
import {
  trainingStatsActions,
  trainingStatsSelectors,
} from "../../../state/ducks/dashboard.new/trainingStats";
import AsyncGate from "../../components/AsyncGate";
import useActionCreator from "../../hooks/useActionCreator";

const TrainingStatsContainer: React.FunctionComponent = () => {
  const classes = styles();

  const loadTrainingStatsList = useActionCreator(
    trainingStatsActions.loadTrainingStatsList
  );

  const loadTrainingStatsListAsyncInfo = useSelector(
    trainingStatsSelectors.getLoadTrainingStatsListAsyncInfo
  );

  const [tabValue, setTabValue] = React.useState(0);
  const handleChildTabChange = (val: number) => {
    setTabValue(val);
  };
  return (
    <Box className={classes.outline}>
      <AsyncGate
        asyncAction={loadTrainingStatsList}
        asyncState={loadTrainingStatsListAsyncInfo}
        startActionOnMount={true}
      >
        <TrainingChart tabValue={tabValue} />
        <TrainingLineItems infoChangeTab={handleChildTabChange} />
      </AsyncGate>
    </Box>
  );
};

export default TrainingStatsContainer;
