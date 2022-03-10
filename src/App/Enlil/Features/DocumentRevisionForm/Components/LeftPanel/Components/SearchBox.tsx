import { Box, IconButton } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import Colors from "../../../../../../../ui/layout/theme/utils/colors";

interface Props {
  onSearch: (event: any) => void;
}
const SearchBox: React.FunctionComponent<Props> = ({ onSearch }) => (
  <Box
    style={{
      height: "36px",
      width: 270,
      borderRadius: "100px",
      border: "1px solid #CCD4D9",
      boxSizing: "border-box",
    }}
  >
    <IconButton type="submit" size="small" disableRipple>
      <SearchIcon style={{ color: Colors.navy, margin: "2px 0px 0px 8px", fontSize: "20px" }}/>
    </IconButton>
    <InputBase placeholder="Search" onChange={onSearch} />
  </Box>
);

export default SearchBox;
