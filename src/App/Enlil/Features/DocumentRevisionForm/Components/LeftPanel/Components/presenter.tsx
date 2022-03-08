import { Box, IconButton } from "@material-ui/core";
import React from "react";
import ListPanel from "./ListPanel";
import SearchBox from "./SearchBox";
import ToggleButtonLeft from "./ToggleButtonLeft";

const LeftPresenter: React.FunctionComponent = () => (
  <Box>

    {/* List */}
    <Box style={{
      // position: "absolute",
      width: "298.85px",
      height: "33.95px",
      // left: "12px",
      top: "9.92px",
      borderBottom: "1px solid #CCD4D9",
      // background:"red"
    }}>
      <div
        style={{
          // position: "absolute",
          width: "124px",
          left: "5%",
          top: "30%",
          bottom: "0%",
          fontFamily: "Sora",
          fontStyle: "normal",
          fontWeight: "bold",
          fontSize: "12px",
          lineHeight: "15px",
          color: "#162229",
          flex: "none",
          order: 0,
          flexGrow: 0,
          margin: "0px 5px",
          // borderBottom: "1px solid #CCD4D9",
          // ransform: "rotate(180deg)"
        }}>Title</div>
      <IconButton
        disableRipple={true}
        size="small"
        edge="end"
      >
      </IconButton>
    </Box>
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
