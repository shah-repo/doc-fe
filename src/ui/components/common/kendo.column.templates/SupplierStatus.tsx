import { Chip, Grid } from '@material-ui/core';
import cx from 'classnames';
import { get } from 'lodash';
import React, { useContext } from 'react';
import useCommonStatusStyles from '../../../../../src/ui/components/common/kendo.column.templates/Status.styles';
import { DocTypeTableContext } from '../../../documentType/grid/interfaces';
import { ASL_STATUS_CLASS_MAPPING } from '../../../form.builder/FBProductOrService/constants';
import OverflowTooltip from '../../OverflowTooltip';
import { CustomGridCellProps } from '../kendo/types';
import useStyles from './Status.styles';

export const SupplierStatus: React.FC<CustomGridCellProps> = ({
  dataItem,
  field = '',
  colSpan,
  style,
  className,
  columnIndex,
  cellRowClick,
}) => {
  const classes = useStyles();
  const statusClasses = useCommonStatusStyles();
  const docTypeTableContext = useContext(DocTypeTableContext);
  const handleOnClick = () => cellRowClick?.({ dataItem });
  const defaultValue = get(dataItem, field, '');
  const statusData = docTypeTableContext?.aslStatuses?.find((data) => data.id === defaultValue);
  const statusClassLabel = statusData?.internalType;
  const label = statusData?.displayLabel;

  return (
    <td
      colSpan={colSpan}
      style={style}
      role="gridcell"
      className={className}
      data-grid-col-index={columnIndex}
      data-cy="cell-status"
      onClick={handleOnClick}
    >
      <Grid
        justify="flex-start"
        alignItems="center"
        container
        data-cy={`supplier-status-button-${label}`}
      >
        {label && <OverflowTooltip arrow placement="top" title={label}>
          <Chip
            size="small"
            className={cx(
              statusClasses.chip,
              classes.aslChipTextOverflow,
              statusClasses[ASL_STATUS_CLASS_MAPPING[statusClassLabel ?? '']],
            )}
            label={label}
          />
        </OverflowTooltip>}
      </Grid>
    </td>
  );
};
