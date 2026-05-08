import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip } from '@material-ui/core';
import { GetTagProps } from '@material-ui/lab/Autocomplete';
import cx from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { Dialog } from '../../../../components/dialogs';
import { Autocomplete } from '../../../../components/forms/fields-next';
import { AutocompleteControl } from '../../../../components/forms/fields-next/Autocomplete/Autocomplete';
import { withThemeNext } from '../../../../layout/theme-next';
import { getRepeatedSerialKeys, normalizeSerial, sanitizeSerials, splitSerials } from '../../helpers';
import { useExistingSerialsCheck } from '../../hooks';
import useStyles from './styles';

interface AddDialogProps {
  isOpen: boolean
  shouldValidateRemotely?: boolean
  existingSerials: string[]
  onCheckExistingSerialNumbers: (serials: string[]) => Promise<string[]>
  onConfirm: (serials: string[]) => Promise<void>
  onClose: () => void
}

const AddDialog: React.FC<AddDialogProps> = ({
  isOpen,
  shouldValidateRemotely,
  onCheckExistingSerialNumbers,
  existingSerials,
  onConfirm,
  onClose,
}) => {
  const classes = useStyles();
  const [serials, setSerials] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sanitizedSerials = useMemo(() => sanitizeSerials(serials), [serials]);
  const repeatedKeys = useMemo(() => getRepeatedSerialKeys(sanitizedSerials), [sanitizedSerials]);
  const hasRepeated = repeatedKeys.size > 0;

  const {
    isChecking,
    hasExistingMatches: hasExistingMatchesFromCheck,
    hasError,
    existingKeys: existingKeysFromCheck,
  } = useExistingSerialsCheck(
    shouldValidateRemotely ? sanitizedSerials : [],
    isOpen && !hasRepeated,
    onCheckExistingSerialNumbers,
  );

  const existingKeys = useMemo(() => {
    if (shouldValidateRemotely) {
      return existingKeysFromCheck;
    }

    return new Set(sanitizedSerials.filter(serial => existingSerials.includes(serial)));
  }, [shouldValidateRemotely, existingKeysFromCheck, existingSerials, sanitizedSerials]);

  const hasExistingMatches = useMemo(() => {
    if (shouldValidateRemotely) {
      return hasExistingMatchesFromCheck;
    }

    return existingKeys.size > 0;
  }, [shouldValidateRemotely, hasExistingMatchesFromCheck, existingKeys]);

  const errorMessage = hasRepeated
    ? translate('form.builder.serials.add.dialog.duplicate.serials')
    : hasExistingMatches
      ? translate('form.builder.serials.add.dialog.invalid.serials')
      : hasError
        ? translate('form.builder.serials.add.dialog.validation.failed')
        : '';

  const isConfirmDisabled = isSubmitting
    || sanitizedSerials.length === 0
    || isChecking
    || errorMessage !== '';

  const handleClose = () => {
    setSerials([]);
    setInputValue('');
    onClose();
  };

  const handleConfirm = async () => {
    if (isConfirmDisabled) {
      return;
    }

    setIsSubmitting(true);
    setSerials(sanitizedSerials);

    try {
      await onConfirm(sanitizedSerials);
      setSerials([]);
      setInputValue('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    const text = event.clipboardData.getData('text');
    const parsed = splitSerials(text);
    if (parsed.length > 1) {
      event.preventDefault();
      setSerials(prev => [...prev, ...parsed]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, originalOnKeyDown?: React.KeyboardEventHandler) => {
    if (event.key === ',') {
      event.preventDefault();
      const v = inputValue.trim();
      if (v) {
        setSerials(prev => [...prev, v]);
        setInputValue('');
      }
      return;
    }
    originalOnKeyDown?.(event);
  };

  const inputHelp = useMemo(() => {
    return inputValue && serials.length === 0
      ? <Chip
        size="small"
        className={classes.helper}
        label={
          <span className={classes.helperText}>
            <FontAwesomeIcon icon={regular('arrow-turn-down-left')} />
            <span>{translate('form.builder.serials.add.dialog.hint')}</span>
          </span>
        }
      />
      : null;
  }, [inputValue, classes.helper, classes.helperText, serials.length]);

  const renderTags = useCallback((value: string[], getTagProps: GetTagProps) => {
    return value.map((option, index) => {
      const normalizedOption = normalizeSerial(option);
      const isInvalid = repeatedKeys.has(normalizedOption) || existingKeys.has(normalizedOption);
      const tagProps = getTagProps({ index }) as { className?: string };
      return (
        <Chip
          key={`${option}-${index}`}
          label={option}
          size="small"
          {...tagProps}
          className={cx(tagProps.className, { [classes.invalidSerial]: isInvalid })}
        />
      );
    });
  }, [
    classes.invalidSerial,
    existingKeys,
    repeatedKeys,
  ]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={translate('form.builder.serials.add.dialog.title')}
      confirmLabel={translate('common.add')}
      onConfirm={handleConfirm}
      confirmProps={{ disabled: isConfirmDisabled }}
      disableBackdropClick
      maxWidth="sm"
      fullWidth
    >
      <div onPaste={handlePaste}>
        <Autocomplete
          multiple
          disableClearable
          filterSelectedOptions
          freeSolo
          options={[]}
          value={serials}
          shouldAlwaysShowPlaceholder
          onChange={(_, value: string[]) => {
            setSerials(value);
            setInputValue('');
          }}
          onInputChange={(_, value: string) => setInputValue(value)}
          classes={{
            inputRoot: classes.autocompleteField,
          }}
          getOptionSelected={() => false}
          renderTags={renderTags}
          renderInput={(params) => (
            <AutocompleteControl
              {...params}
              size="medium"
              InputProps={{
                ...params.InputProps,
                endAdornment: inputHelp,
                onKeyDown: (e) => handleKeyDown(e),
              }}
              inputProps={{
                ...params.inputProps,
                ...(inputHelp ? {
                  className: classes.autocompleteInputWithHelp,
                  style: {
                    width: `${Math.max(2, inputValue.length)}ch`,
                  },
                } : {}),
              }}
              placeholder={translate('form.builder.serials.add.dialog.placeholder')}
            />
          )}
        />
        {errorMessage && (
          <div className={classes.invalidSerialsMessage}>
            <span dangerouslySetInnerHTML={{ __html: errorMessage }} />
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default withThemeNext(AddDialog);
