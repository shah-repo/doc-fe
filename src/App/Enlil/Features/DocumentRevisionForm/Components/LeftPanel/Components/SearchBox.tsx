import { Box, IconButton } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import styles from "./SearchBox.styles";

interface Props {
  onSearch: (event) => void;
}
const SearchBox: React.FunctionComponent<Props> = ({ onSearch }) => {
  const classes = styles();
  return (
    <Box className={classes.searchBox}>
      <IconButton type="submit" size="small" disableRipple>
        <SearchIcon className={classes.searchIcon} />
      </IconButton>
      <InputBase placeholder="Search" onChange={onSearch} />
    </Box>
  );
};

export default SearchBox;
