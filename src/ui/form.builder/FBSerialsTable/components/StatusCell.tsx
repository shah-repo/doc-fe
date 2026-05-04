import cx from 'classnames';
import React from 'react';
import { Autocomplete } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../components/KendoDataGrid/constants';
import { SerialNumberStatus, SerialsSelectOption } from '../../FBSerials/types';
import useStyles from '../styles';
import { TableCellProps } from '../types';

interface Props extends TableCellProps {
  options: Array<SerialsSelectOption<SerialNumberStatus>>
  onChange: (id: string, status: SerialNumberStatus | null) => void
}

interface StatusLabelProps {
  option: SerialsSelectOption<SerialNumberStatus>
  classes: ReturnType<typeof useStyles>
}

const StatusLabel: React.FC<StatusLabelProps> = ({
  option,
  classes,
}) => (
  <span className={classes.statusOption}>
    <span className={cx(
      classes.dot,
      {
        [classes.accepted]: option.value === SerialNumberStatus.ACCEPTED,
        [classes.rejected]: option.value === SerialNumberStatus.REJECTED,
      })}
    />
    <span>{option.text}</span>
  </span>
);

const StatusCell: React.FC<Props> = ({
  isTableDisabled,
  dataItem,
  options,
  onChange,
}) => {
  const classes = useStyles();

  const activeOption = options.find(option => option.value === dataItem.status || (!option.value && !dataItem.status));

  if (isTableDisabled) {
    return activeOption?.value ? <StatusLabel option={activeOption} classes={classes} /> : <>{EMPTY_VALUE_PLACEHOLDER}</>;
  }

  return (
    <Autocomplete
      options={options}
      size="small"
      disabled={dataItem.isDisabled}
      disableClearable
      blurOnSelect
      filterSelectedOptions
      renderOption={(option: SerialsSelectOption<SerialNumberStatus>) => (
        <StatusLabel option={option} classes={classes} />
      )}
      inputProps={{
        startAdornment: (
          <span className={cx(
            classes.dot,
            classes.startAdornment,
            {
              [classes.accepted]: activeOption?.value === SerialNumberStatus.ACCEPTED,
              [classes.rejected]: activeOption?.value === SerialNumberStatus.REJECTED,
            })}
          />
        ),
      }}
      getOptionLabel={(option: SerialsSelectOption<SerialNumberStatus>) => option.value ? option.text : ''}
      value={activeOption}
      onChange={(e, value?: SerialsSelectOption<SerialNumberStatus>) => {
        if (!value) return;
        onChange(dataItem.id, value.value);
      }}
    />
  );
};

export default StatusCell;
