import { Box } from "@material-ui/core";
import React from "react";
import LeftToggleButtons from "./LeftToggleButtons";
import ListPanel from "./ListPanel";

const LeftPresenter: React.FunctionComponent = () => (
  <Box>
    {/* Toogle Button */}
    <Box
      padding="20px 0px 10px 0px"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <LeftToggleButtons />
    </Box>
    {/* List Panel and Search Box */}
    <ListPanel />
  </Box>
);

export default LeftPresenter;
