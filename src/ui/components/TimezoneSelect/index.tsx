import { find, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../common/intl';
import { timezoneActions } from '../../../state/ducks/timezoneSelect';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import useDialog from '../../hooks/useDialog';
import { AlertDialog } from '../dialogs';
import { Autocomplete } from '../forms/fields-next';
import { toastError } from '../notifications';
import { TimezoneOption, TimezoneResponseBody, TimezoneSelectProps } from './types';

const TimezoneSelect: React.FC<TimezoneSelectProps> = ({
  value,
  onChange,
  placeholder = translate('common.select'),
  disabled = false,
  disableClearable,
}) => {
  const [timezoneOptions, setTimezoneOptions] = useState<TimezoneOption[]>();
  const timezone = find(timezoneOptions, { value });
  const fetchTimezonesList = useActionCreator(timezoneActions.fetchTimezonesList);
  const [selectedTimezoneDraft, setSelectedTimezoneDraft] = useState<TimezoneOption | null>(null);
  const timezoneChangeDialog = useDialog();
  const [autocompleteResetCounter, setAutocompleteResetCounter] = useState(0);

  const prepareTimzoneOptions = (timezoneOptions: TimezoneResponseBody[]) =>
    timezoneOptions.map((timzone) => ({
      value: timzone?.name ?? '',
      label: `(GMT${timzone?.offsetFromUTC}) ${timzone?.name.replace(/_/g, ' ')}`,
      offset: timzone?.offsetFromUTC ?? '',
      abbrev: timzone?.abbreviation ?? '',
      altName: timzone?.abbreviation ?? '',
    }));

  const timezoneAsync = useAsync<TimezoneResponseBody[]>({
    onSuccess: (data: TimezoneResponseBody[] | undefined) => {
      setTimezoneOptions(prepareTimzoneOptions(data ?? []));
    },
    onError: toastError,
  });

  const loadTimezonesList = () => {
    timezoneAsync.start(fetchTimezonesList, timezoneAsync);
  };

  useEffect(() => {
    loadTimezonesList();
  }, []);

  const handleSelect = (_: unknown, selectedOption: TimezoneOption | null) => {
    if (!selectedOption || selectedOption.value === value) {
      return;
    }

    setSelectedTimezoneDraft(selectedOption);
    timezoneChangeDialog.open();
  };

  const handleConfirm = () => {
    if (selectedTimezoneDraft) {
      onChange(selectedTimezoneDraft);
    }

    timezoneChangeDialog.close();
    setSelectedTimezoneDraft(null);
    setAutocompleteResetCounter((k) => k + 1);
  };

  const handleCancel = () => {
    timezoneChangeDialog.close();
    setSelectedTimezoneDraft(null);
    setAutocompleteResetCounter((k) => k + 1);
  };

  return (
    <>
      <Autocomplete
        key={`${isEmpty(timezoneOptions) ? 'disable' : 'enable'}-${autocompleteResetCounter}`}
        options={timezoneOptions}
        getOptionLabel={(option: TimezoneOption) => option.label}
        placeholder={placeholder}
        value={timezone}
        onChange={handleSelect}
        autoHighlight
        clearOnEscape
        disabled={disabled || timezoneChangeDialog.isOpen}
        disableClearable={disableClearable || !timezone}
      />
      <AlertDialog
        handler={timezoneChangeDialog}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        confirmLabel="common.confirm"
      >
        {translate('administration.general.settings.timezone.confirm.message')}
      </AlertDialog>
    </>
  );
};

export default TimezoneSelect;
