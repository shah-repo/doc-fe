import { TextField } from '@material-ui/core';
import { GridFilterCellProps } from '@progress/kendo-react-grid';
import * as React from 'react';
import { useIntl } from 'react-intl';
import {
  getFormattedDateString,
  MomentFormats,
} from '../../../../common/utils/date';
import {
  DisplayText,
  TranslatedText,
} from '../../../components/common/kendo/helpers';

export const DateFilterTemplate = ({
  onChange,
  value,
}: GridFilterCellProps) => {
  const hasValue = (value: string) => value;
  const intl = useIntl();
  const handleDateChange = ({ target, syntheticEvent }: any) => {
    const isValueExists = hasValue(target.value);
    onChange({
      value: isValueExists
        ? getFormattedDateString(
          target.value,
          MomentFormats.AsyncTasksDefaultDateTimeFormatter
        )
        : '',
      operator: isValueExists ? 'lte' : '',
      syntheticEvent,
    });
  };
  const onClearButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onChange({
      value: '',
      operator: '',
      syntheticEvent: event,
    });
  };

  return (
    <div className="k-filtercell">
      <TextField
        id="datetime-local"
        type="datetime-local"
        defaultValue={value}
        InputLabelProps={{
          shrink: true,
        }}
        onChange={handleDateChange}
      />
      <button
        className="k-button k-button-icon k-clear-button-visible"
        title={intl.formatMessage({ id: TranslatedText[DisplayText.CLEAR] })}
        disabled={!hasValue(value)}
        onClick={onClearButtonClick}
      >
        <span className="k-icon k-i-filter-clear" />
      </button>
    </div>
  );
};
