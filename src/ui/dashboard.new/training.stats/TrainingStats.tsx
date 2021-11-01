import { Box } from "@material-ui/core";
import { pick } from "lodash";
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
import { Status } from "../../../state/ducks/dashboard.new/trainingStats/types";
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
  const trainingStats = useSelector(trainingStatsSelectors.trainingStats);

  console.log("Load TrainingStats List ::", loadTrainingStatsList);
  console.log("Training Stats AsyncInfo ::", loadTrainingStatsListAsyncInfo);
  console.log("Training Stats ::", trainingStats);

  const [tabValue, setTabValue] = React.useState(0);
  const handleChildTabChange = (val: number) => {
    setTabValue(val);
  };
  const trainingData = trainingStats?.trainingStats.filter((item) => {
    pick(item.user, ["name", "avatar"]);
    return item.status === Status.OVERDUE || item.status === Status.DUE;
  });
  return (
    <Box className={classes.outline}>
      <AsyncGate
        asyncAction={loadTrainingStatsList}
        asyncState={loadTrainingStatsListAsyncInfo}
        startActionOnMount={true}
      >
        <TrainingChart trainingData={trainingData} tabValue={tabValue} />
        <TrainingLineItems
          infoChangeTab={handleChildTabChange}
          trainingData={trainingData}
        />
      </AsyncGate>
    </Box>
  );
};

export default TrainingStatsContainer;
