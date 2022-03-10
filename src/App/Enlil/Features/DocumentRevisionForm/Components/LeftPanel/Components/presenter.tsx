import { Box } from "@material-ui/core";
import React from "react";
import LeftPanelTabs from "./LeftPanelTabs";
import ListPanel from "./ListPanel";
import SearchBox from "./SearchBox";

const LeftPresenter: React.FunctionComponent = () => (
  <Box>
    {/* Toogle Button */}
    <Box
      padding="20px 0px 10px 0px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <LeftPanelTabs />
    </Box>
    {/* Search Box */}
    <Box
      padding="10px 0px 20px 0px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <SearchBox />
    </Box>
    {/* List Panel  */}
    <Box height="calc(100vh - 235px)" overflow="auto">
      <ListPanel />
    </Box>
  </Box>
);

export default LeftPresenter;
