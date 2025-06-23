import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import React from 'react';
import { SupplierScanResultRevision } from '../../interface';
import { EXPAND_FIELD } from '../constants';
import { CustomTemplateProps } from '../types';
import useStyles from './styles';

interface ExpandCollapseCellProps extends CustomTemplateProps {
  onDataItemExpanded?: (dataItem: SupplierScanResultRevision) => void
}

export const ExpandCollapseCell: React.FC<ExpandCollapseCellProps> = (props) => {
  const { dataItem, onDataItemExpanded } = props;
  const classes = useStyles();

  return (
    <Box className={classes.container}>
      <FontAwesomeIcon
        data-cy="minimize-row-button"
        icon={dataItem[EXPAND_FIELD] ? regular('square-minus') : solid('square-plus')}
        className={classes.expand}
        onClick={() => onDataItemExpanded?.(dataItem)}
      />
    </Box>
  );
};
