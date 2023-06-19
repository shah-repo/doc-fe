import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import React, { useCallback } from 'react';
import { FBFieldBottomBarProps } from '..';
import { translate } from '../../../common/intl';
import { Button } from '../../components/forms/fields-next';
import { withFBStarter } from '../FBStarter/FBStarter.wrap';
import useStyles from './FBFieldBottomBar.styles';

const FBFieldBottomBar: React.FC<FBFieldBottomBarProps> = ({
  onClick,
  index = 0,
  label = 'form.builder.add.field',
}) => {
  const classes = useStyles();

  const handleAddClick = useCallback(() => {
    onClick?.(index + 1);
  }, [index, onClick]);

  return (
    <Box className={classes.root}>
      <Button
        attached
        data-cy="form.builder.add.field"
        className={classes.button}
        startIcon={<FontAwesomeIcon icon={solid('plus')} />}
        onClick={handleAddClick}
      >
        {translate(label)}
      </Button>
    </Box>
  );
};

export default withFBStarter(FBFieldBottomBar);
