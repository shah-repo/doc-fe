import cx from 'classnames';
import React from 'react';
import { Autocomplete } from '../../../components/forms/fields-next';
import useStyles from '../styles';
import { SerialNumber, SerialNumberStatus, SerialsSelectOption } from '../types';

interface Props {
  dataItem: SerialNumber
  options: Array<SerialsSelectOption<SerialNumberStatus>>
  onChange: (id: string, status: SerialNumberStatus | null) => void
}

const StatusCell: React.FC<Props> = ({ dataItem, options, onChange }) => {
  const classes = useStyles();

  const activeOption = options.find(option => option.value === dataItem.status || (!option.value && !dataItem.status));

  return (
    <Autocomplete
      options={options}
      size="small"
      disableClearable
      blurOnSelect
      filterSelectedOptions
      renderOption={(option: SerialsSelectOption<SerialNumberStatus>) => (
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
