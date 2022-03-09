import { Box } from "@material-ui/core";
import React from "react";
import ListPanel from "./ListPanel";
import SearchBox from "./SearchBox";
import ToggleButtonLeft from "./ToggleButtonLeft";

const LeftPresenter: React.FunctionComponent = () => (
  <Box>
    {/* Toogle Button */}
    <Box style={{ paddingTop: "10px" }}>
      <ToggleButtonLeft/>
    </Box>
    {/* Search Box */}
    <Box style={{ paddingTop: "10px" }}>
      <SearchBox/>
    </Box>
    {/* <Box> */}
    <ListPanel/>
    {/* </Box> */}
  </Box>
);

export default LeftPresenter;
