import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip } from '@material-ui/core';
import { GetTagProps } from '@material-ui/lab/Autocomplete';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { translate } from '../../../../../common/intl';
import { Dialog } from '../../../../components/dialogs';
import { Autocomplete } from '../../../../components/forms/fields-next';
import { AutocompleteControl } from '../../../../components/forms/fields-next/Autocomplete/Autocomplete';
import { withThemeNext } from '../../../../layout/theme-next';
import { SERIAL_VALIDATION_DEBOUNCE_MS } from '../../consts';
import { normalizeSerial, sanitizeSerials, splitSerials } from '../../helpers';
import useStyles from './styles';

interface AddDialogProps {
  isOpen: boolean
  onCheckExistingSerialNumbers: (serials: string[]) => Promise<string[]>
  onConfirm: (serials: string[]) => Promise<void>
  onClose: () => void
}

const getRepeatedSerialKeys = (serials: string[]): Set<string> => {
  const counts = serials.reduce<Record<string, number>>((acc, serial) => {
    const key = normalizeSerial(serial);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return new Set(Object.keys(counts).filter(key => counts[key] > 1));
};

const getMatchingExistingSerials = (serials: string[], existingSerials: string[]): string[] => {
  const submittedSerialKeys = new Set(serials.map(normalizeSerial));
  const matchingSerials = existingSerials.filter(serial =>
    submittedSerialKeys.has(normalizeSerial(serial)));
  const uniqueMatchingSerials = new Map<string, string>();

  matchingSerials.forEach(serial => uniqueMatchingSerials.set(normalizeSerial(serial), serial));
  return Array.from(uniqueMatchingSerials.values());
};

const getSerialsValidationKey = (serials: string[]): string => serials.map(normalizeSerial).join('\n');

export const AddDialog: React.FC<AddDialogProps> = ({
  isOpen,
  onCheckExistingSerialNumbers,
  onConfirm,
  onClose,
}) => {
  const classes = useStyles();
  const [serials, setSerials] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingExistingSerials, setIsCheckingExistingSerials] = useState(false);
  const [existingCompanySerials, setExistingCompanySerials] = useState<string[]>([]);
  const [validationErrorMessage, setValidationErrorMessage] = useState('');
  const [validatedSerialsKey, setValidatedSerialsKey] = useState('');
  const validationRequestId = useRef(0);

  const clearValidationState = useCallback(() => {
    validationRequestId.current += 1;
    setIsCheckingExistingSerials(false);
    setExistingCompanySerials([]);
    setValidationErrorMessage('');
    setValidatedSerialsKey('');
  }, []);

  const resetDialog = useCallback(() => {
    setSerials([]);
    setInputValue('');
    clearValidationState();
  }, [clearValidationState]);

  const updateSerials = useCallback((nextSerials: string[]) => {
    setSerials(nextSerials);
    clearValidationState();
  }, [clearValidationState]);

  const sanitizedSerials = useMemo(() => sanitizeSerials(serials), [serials]);
  const sanitizedSerialsKey = useMemo(() => getSerialsValidationKey(sanitizedSerials), [sanitizedSerials]);

  const repeatedSerialKeys = useMemo(
    () => getRepeatedSerialKeys(sanitizedSerials),
    [sanitizedSerials],
  );
  const hasRepeatedSerials = repeatedSerialKeys.size > 0;

  const existingCompanySerialKeys = useMemo(() => {
    return new Set(existingCompanySerials.map(normalizeSerial));
  }, [existingCompanySerials]);
  const hasExistingCompanySerials = existingCompanySerials.length > 0;
  const hasValidationError = validationErrorMessage.length > 0;

  const debouncedCheckExistingSerialNumbers = useMemo(() => debounce((
    requestSerials: string[],
    requestSerialsKey: string,
    requestId: number,
  ) => {
    onCheckExistingSerialNumbers(requestSerials)
      .then((existingCompanySerialNumbers) => {
        if (requestId !== validationRequestId.current) {
          return;
        }

        setExistingCompanySerials(getMatchingExistingSerials(
          requestSerials,
          existingCompanySerialNumbers,
        ));
        setValidatedSerialsKey(requestSerialsKey);
        setIsCheckingExistingSerials(false);
      })
      .catch(() => {
        if (requestId !== validationRequestId.current) {
          return;
        }

        setValidationErrorMessage(translate('form.builder.serials.add.dialog.validation.failed'));
        setIsCheckingExistingSerials(false);
      });
  }, SERIAL_VALIDATION_DEBOUNCE_MS), [onCheckExistingSerialNumbers]);

  useEffect(() => {
    validationRequestId.current += 1;
    const requestId = validationRequestId.current;

    setExistingCompanySerials([]);
    setValidationErrorMessage('');
    setValidatedSerialsKey('');

    if (
      !isOpen
      || sanitizedSerials.length === 0
      || hasRepeatedSerials
    ) {
      setIsCheckingExistingSerials(false);
      return;
    }

    setIsCheckingExistingSerials(true);
    debouncedCheckExistingSerialNumbers(
      sanitizedSerials,
      sanitizedSerialsKey,
      requestId,
    );

    return () => {
      validationRequestId.current += 1;
      debouncedCheckExistingSerialNumbers.cancel();
    };
  }, [
    debouncedCheckExistingSerialNumbers,
    hasRepeatedSerials,
    isOpen,
    sanitizedSerials,
    sanitizedSerialsKey,
  ]);

  const handleClose = () => {
    resetDialog();
    onClose();
  };

  const handleConfirm = async () => {
    const submittedSerials = sanitizeSerials(serials);
    if (
      submittedSerials.length === 0
      || hasRepeatedSerials
      || hasExistingCompanySerials
      || hasValidationError
      || isCheckingExistingSerials
      || (shouldValidateExistingCompanySerials && !hasCompletedExistingCompanySerialsCheck)
    ) {
      return;
    }

    setIsSubmitting(true);
    setSerials(submittedSerials);

    try {
      await onConfirm(submittedSerials);
      resetDialog();
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
      clearValidationState();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, originalOnKeyDown?: React.KeyboardEventHandler) => {
    if (event.key === ',') {
      event.preventDefault();
      const v = inputValue.trim();
      if (v) {
        setSerials(prev => [...prev, v]);
        setInputValue('');
        clearValidationState();
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
      const isInvalid = repeatedSerialKeys.has(normalizedOption) || existingCompanySerialKeys.has(normalizedOption);
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
    existingCompanySerialKeys,
    repeatedSerialKeys,
  ]);

  const shouldValidateExistingCompanySerials = sanitizedSerials.length > 0;
  const hasCompletedExistingCompanySerialsCheck = validatedSerialsKey === sanitizedSerialsKey;

  const isConfirmDisabled = sanitizedSerials.length === 0
    || isSubmitting
    || hasRepeatedSerials
    || hasExistingCompanySerials
    || hasValidationError
    || isCheckingExistingSerials
    || (shouldValidateExistingCompanySerials && !hasCompletedExistingCompanySerialsCheck);

  const errorMessage = hasRepeatedSerials
    ? translate('form.builder.serials.add.dialog.duplicate.serials')
    : hasExistingCompanySerials
      ? translate('form.builder.serials.add.dialog.invalid.serials')
      : validationErrorMessage;

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
            updateSerials(value);
            setInputValue('');
          }}
          onInputChange={(_, value: string) => setInputValue(value)}
          classes={{
            inputRoot: classes.autocompleteField,
          }}
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
            {errorMessage}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default withThemeNext(AddDialog);
