import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import React from 'react';
import { ISupplierScanResultRev } from '../../interface';
import { EXPAND_FIELD } from '../constants';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';
interface Props extends CustomTemplateProps {
  onDataItemExpanded?: (dataItem: ISupplierScanResultRev) => void
}

export const ExpandCollapseCell: React.FC<Props> = (props) => {
  const { dataItem, onDataItemExpanded } = props;
  const classes = styles();

  return (
    <Box className={classes.container} >
      <FontAwesomeIcon
        data-cy="minimize-row-button"
        icon={dataItem[EXPAND_FIELD] ? regular('square-minus') : solid('square-plus')}
        className={classes.expand}
        onClick={() => onDataItemExpanded?.(dataItem)}
      />
    </Box>
  );
};
