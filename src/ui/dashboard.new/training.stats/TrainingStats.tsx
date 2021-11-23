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
import { styles } from "./TrainingStats.styles";

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
    <Box className={classes.outline} marginLeft={2} marginRight={2}>
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
