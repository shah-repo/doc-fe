import { Box } from "@material-ui/core";
import React from "react";
import ListPanel from "./ListPanel";
import SearchBox from "./SearchBox";
import ToggleButtonLeft from "./ToggleButtonLeft";

const LeftPresenter: React.FunctionComponent = () => (
  <Box>
    {/* Toogle Button */}
    <Box
      padding="20px 0px 10px 0px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <ToggleButtonLeft />
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
