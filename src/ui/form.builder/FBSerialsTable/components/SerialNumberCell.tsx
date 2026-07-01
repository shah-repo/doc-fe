import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@material-ui/core';
import cx from 'classnames';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import OverflowTooltip from '../../../components/OverflowTooltip';
import { useSerialNumberCellStyles } from '../styles';
import { TableCellProps } from '../types';

interface Props extends TableCellProps {
  shouldShowStepAndSequence?: boolean
}

const SerialNumberCell: React.FC<Props> = ({
  isTableDisabled,
  dataItem,
  field,
  shouldShowStepAndSequence = false,
}) => {
  const defaultValue = get(dataItem, field, '') as string;
  const classes = useSerialNumberCellStyles();

  const shouldDisableRow = dataItem.isDisabled && !isTableDisabled;

  const { step, sequence } = dataItem.meta?.updatedIn ?? {};

  const translationPrefix = shouldShowStepAndSequence ? '' : '.in.next.steps';

  const tooltipText = step && sequence && shouldShowStepAndSequence
    ? translate('form.builder.serials.disabled.in', { step, sequence })
    : translate(`form.builder.serials.disabled${translationPrefix}`);

  return (
    <div className={classes.root}>
      <OverflowTooltip
        title={defaultValue}
        placement="top"
        arrow
      >
        <span className={cx({ [classes.disabledValue]: shouldDisableRow })}>{defaultValue}</span>
      </OverflowTooltip>
      {shouldDisableRow && (
        <Tooltip title={tooltipText} classes={{ tooltip: classes.tooltip }} arrow>
          <FontAwesomeIcon className={classes.disabledIcon} icon={solid('circle-exclamation')} />
        </Tooltip>
      )}
    </div>
  );
};

export default SerialNumberCell;
