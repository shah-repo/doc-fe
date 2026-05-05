import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { useTextCellStyles } from '../styles';
import { TableCellProps } from '../types';

const TextCell: React.FC<TableCellProps> = ({
  isTableDisabled,
  dataItem,
  field,
}) => {
  const defaultValue = get(dataItem, field, '') as string;
  const classes = useTextCellStyles();

  const shouldDisableRow = dataItem.isDisabled && !isTableDisabled;

  return (
    <OverflowTooltip
      title={defaultValue}
      placement="top"
      arrow
    >
      <span className={cx({ [classes.disabledValue]: shouldDisableRow })}>{defaultValue}</span>
      {shouldDisableRow && (
        <Tooltip title={translate('form.builder.serials.disabled.in.next.steps')}>
          <FontAwesomeIcon className={classes.disabledIcon} icon={solid('circle-exclamation')} />
        </Tooltip>
      )}
    </OverflowTooltip>
  );
};

export default TextCell;
