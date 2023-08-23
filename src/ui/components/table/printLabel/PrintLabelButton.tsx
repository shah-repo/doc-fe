import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import React from 'react';
import Colors from '../../../layout/theme/utils/colors';
import Text from '../../Text';

interface Props {
  clearFilter?: () => void
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    clearButton: {
      margin: theme.spacing(0, 2, 0, 0),
      backgroundColor: Colors.white,
      borderRadius: 25,
      textTransform: 'none',
      fontSize: 12,
      fontWeight: 600,
      color: Colors.navy,
      border: `1px solid ${Colors.navy}`,
    },
  },
  ));

const PrintLabelButton: React.FunctionComponent<Props> = ({
  printLabel, disabled
}) => {
  const classes = styles();
  return (
    <Button
      variant="outlined"
      className={classes.clearButton}
      onClick={printLabel}
      id="printButton"
      data-cy="printButton"
			{...{ disabled }}
    >
      <Text translation="common.print" />
    </Button>
  );
};

export default PrintLabelButton;
