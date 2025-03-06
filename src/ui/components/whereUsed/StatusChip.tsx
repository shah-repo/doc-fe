import { Chip } from '@material-ui/core';
import { upperCase } from 'lodash';
import React from 'react';
import { STATUS_TYPES_LABEL } from '../../../state/ducks/dashboard.new/my.feeds/types';
import { FormHeaderStatusClassMapping } from '../common/header/Helpers';
import useStyles from './whereUsedTree.styles';

export default function StatusChip ({ status }: { status: string }) {
  const classes = useStyles({ size: undefined });
  return (
    <Chip
      size="small"
      className={`${classes.chip} ${
        classes[FormHeaderStatusClassMapping[status || '']]
      }`}
      label={STATUS_TYPES_LABEL[upperCase(status)]}
      data-cy="where-used-status"
    />
  );
}
