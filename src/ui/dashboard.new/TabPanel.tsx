import { Grid } from "@material-ui/core";
import React from "react";
import MyFeeds from "./my.feeds/MyFeeds.container";
import Recents from "./recents/Recents.container";
import TrainingStats from "./training.stats/TrainingStats";
import Trainings from "./trainings/Trainings.container";

interface TabPanelProps {
  index: number;
  value: number;
  isDashboardAdmin: boolean;
}

const TabPanel: React.FunctionComponent<TabPanelProps> = ({
  index,
  value,
  isDashboardAdmin,
}) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`scrollable-auto-tabpanel-${index}`}
    aria-labelledby={`scrollable-auto-tab-${index}`}
  >
    {value === index && (
      <Grid container={true}>
        <Grid item={true} md={isDashboardAdmin ? 8 : 12} sm={12}>
          {value === 0 && <MyFeeds />}
          {value === 1 && isDashboardAdmin && <Trainings />}
          {((value === 2 && isDashboardAdmin) ||
            (value === 1 && !isDashboardAdmin)) && <Recents />}
        </Grid>
        {isDashboardAdmin && (
          <Grid item={true} md={4} sm={12}>
            <TrainingStats />
          </Grid>
        )}
      </Grid>
    )}
  </div>
);

export default TabPanel;
