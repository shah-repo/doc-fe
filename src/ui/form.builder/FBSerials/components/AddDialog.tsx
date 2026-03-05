import { regular } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Chip, createStyles, makeStyles } from '@material-ui/core';
import React, { useMemo, useState } from 'react';
import { translate } from '../../../../common/intl';
import { Dialog } from '../../../components/dialogs';
import { Autocomplete } from '../../../components/forms/fields-next';
import { AutocompleteControl } from '../../../components/forms/fields-next/Autocomplete/Autocomplete';
import { Colors, withThemeNext } from '../../../layout/theme-next';

interface AddDialogProps {
  isOpen: boolean
  onConfirm: (serials: string[]) => Promise<void>
  onClose: () => void
}

const useStyles = makeStyles((theme) => createStyles({
  chip: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
  },
  helper: {
    flexShrink: 0,
  },
  helperText: {
    color: Colors.textDisabled,
    fontSize: '0.75rem',
    display: 'flex',
    alignItems: 'end',
    gap: theme.spacing(0.5, 0.5),
  },
  autocompleteField: {
    paddingRight: theme.spacing(0.75),
  },
  autocompleteInput: {
    minWidth: '4ch',
  },
  autocompleteInputWithHelp: {
    flexGrow: 0,
  },
}));

const splitSerials = (text: string): string[] =>
  text.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);

const AddDialog: React.FC<AddDialogProps> = ({
  isOpen,
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
      setSerials(prev => Array.from(new Set([...prev, ...parsed])));
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, originalOnKeyDown?: React.KeyboardEventHandler) => {
    if (event.key === ',') {
      event.preventDefault();
      const v = inputValue.trim();
      if (v) {
        setSerials(prev => Array.from(new Set([...prev, v])));
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

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      title={translate('form.builder.serials.add.dialog.title')}
      confirmLabel={translate('common.add')}
      onConfirm={handleConfirm}
      confirmProps={{ disabled: serials.length === 0 || isSubmitting }}
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
            tag: classes.chip,
            inputRoot: classes.autocompleteField,
          }}
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
                    width: `${Math.max(2, (inputValue.length || 0) + 1)}ch`,
                  },
                } : {}),
              }}
              placeholder={translate('form.builder.serials.add.dialog.placeholder')}
            />
          )}

        />
      </div>
    </Dialog>
  );
};

export default withThemeNext(AddDialog);
