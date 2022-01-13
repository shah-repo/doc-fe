import { Box } from "@material-ui/core";
import React from "react";
import MyFeeds from "./my.feeds/MyFeeds.container";
import Recents from "./recents/Recents.container";
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
      <Box>
        {value === 0 && <MyFeeds />}
        {value === 1 && isDashboardAdmin && <Trainings />}
        {((value === 2 && isDashboardAdmin) ||
            (value === 1 && !isDashboardAdmin)) && <Recents />}
      </Box>
    )}
  </div>
);

export default TabPanel;
