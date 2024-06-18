import { Box, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import { translate } from '../../../../common/intl';
import useStyles from './styles';

interface ListBoxItemsProps {
  title: string
  searchTerm: string
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  children: React.ReactNode
}

const ListBoxItems: React.FC<ListBoxItemsProps> = ({ title, searchTerm, handleSearchChange, children }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Box className={classes.searchBox}>
          <Typography className={classes.title}>{title}</Typography>
          <TextField
            className={classes.search}
            variant="outlined"
            size="small"
            placeholder={translate('common.search')}
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box className={classes.childrenContainer}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default ListBoxItems;
