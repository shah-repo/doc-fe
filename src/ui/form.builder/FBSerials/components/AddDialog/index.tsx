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
import useStyles from './styles';

interface AddDialogProps {
  isOpen: boolean
  existingSerials: string[]
  onConfirm: (serials: string[]) => Promise<void>
  onClose: () => void
}

const splitSerials = (text: string): string[] =>
  text.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);

const AddDialog: React.FC<AddDialogProps> = ({
  isOpen,
  existingSerials,
  onConfirm,
  onClose,
}) => {
  const classes = useStyles();
  const [serials, setSerials] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    setSerials([]);
    onClose();
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(serials);
      setSerials([]);
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

  const allSerials = useMemo(() => {
    return [...existingSerials, ...serials];
  }, [existingSerials, serials]);

  const hasRepeatedSerials = useMemo(() => {
    return new Set(allSerials).size !== allSerials.length;
  }, [allSerials]);

  const renderTags = useCallback((value: string[], getTagProps: GetTagProps) => {
    return value.map((option, index) => {
      const isInvalid = allSerials?.filter(serial => serial === option).length > 1;
      const tagProps = getTagProps({ index }) as { className?: string };
      return (
        <Chip
          key={option}
          label={option}
          size="small"
          {...tagProps}
          className={cx(tagProps.className, { [classes.invalidSerial]: isInvalid })}
        />
      );
    });
  }, [allSerials, classes.invalidSerial]);

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={translate('form.builder.serials.add.dialog.title')}
      confirmLabel={translate('common.add')}
      onConfirm={handleConfirm}
      confirmProps={{ disabled: serials.length === 0 || isSubmitting || hasRepeatedSerials }}
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
        {hasRepeatedSerials && (
          <div className={classes.invalidSerialsMessage}>
            {translate('form.builder.serials.add.dialog.invalid.serials')}
          </div>
        )}
      </div>
    </Dialog>
  );
};

export default withThemeNext(AddDialog);
