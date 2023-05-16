import { Box, IconButton } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import React from 'react';
import { ReactComponent as SearchIcon } from '../../../../../../../assets/images/leftPanel/searchIcon.svg';
import styles from './SearchBox.styles';

interface Props {
  onSearch: (event) => void;
}
const SearchBox: React.FunctionComponent<Props> = ({ onSearch }) => {
  const classes = styles();
  return (
    <Box className={classes.searchBox}>
      <IconButton type="submit" size="small" disableRipple data-cy="formBuilder-search-btn">
        <SearchIcon className={classes.searchIcon} />
      </IconButton>
      <InputBase placeholder="Search" data-cy="formBuilder-search-input"
        onChange={onSearch} className={classes.searchInput} />
    </Box>
  );
};

export default SearchBox;
