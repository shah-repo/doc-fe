import { Box, List, ListItem, Typography } from '@material-ui/core';
import React from 'react';
import { CustomHeaderEntity } from '../../../../state/ducks/bulkImport/types';
import useStyles from './styles';

interface SourceDataListProps {
  data: CustomHeaderEntity[]
}

const SourceDataList: React.FC<SourceDataListProps> = ({ data }) => {
  const classes = useStyles();

  return (
    <List>
      {data.map((item) => (
        <ListItem key={item.id} className={classes.listItem}>
          <Box className={classes.listItemContainer}>
            <Typography className={classes.listItemText}>{item.name}</Typography>
          </Box>
        </ListItem>
      ))}
    </List>
  );
};

export default SourceDataList;
