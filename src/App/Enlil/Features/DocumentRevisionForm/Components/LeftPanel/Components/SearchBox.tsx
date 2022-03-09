import { Box, IconButton } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";

const SearchBox: React.FunctionComponent = () => (
  <Box
    style={{
      // position: "absolute",
      // padding: "20px 20px 20px 12px",
      height: "36px",
      display: "flex",
      alignItems: "center",
      width: 270,
      borderRadius: "100px",
      border: "1px solid #CCD4D9",
      boxSizing: "border-box",
    }}
  >
    <IconButton type="submit" size="small" disableRipple>
      <SearchIcon />
    </IconButton>
    {/* Can use existing code */}
    <InputBase placeholder="Search" />
  </Box>
);

export default SearchBox;
