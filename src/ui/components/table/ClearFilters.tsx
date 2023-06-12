import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import Text from '../../components/Text';
import Colors from '../../layout/theme/utils/colors';

interface Props {
  clearFilter?: () => void;
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    clearButton: {
      margin: theme.spacing(0, 2, 0, 0),
      backgroundColor: Colors.white,
      borderRadius: '100px', // TODO: Move in specific file for border radius
      textTransform: 'none',
      fontSize: 12,
      fontWeight: 600,
      color: Colors.navy,
      border: `1px solid ${Colors.navy}`,
    },
  },
  ));

const ClearFilters: React.FunctionComponent<Props> = ({
  clearFilter,
}) => {
  const classes = styles();
  return (
    <Button
      variant="outlined"
      className={classes.clearButton}
      onClick={clearFilter}
      id="clearFilter"
      data-cy="clearFilter"
    >
      <Text translation="common.clear.filters" />
    </Button>
  );
};

export default ClearFilters;
