import { createStyles, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { translate } from '../../../../common/intl';
import { Dialog } from '../../../components/dialogs';
import { Autocomplete } from '../../../components/forms/fields-next';
import { withThemeNext } from '../../../layout/theme-next';

interface AddDialogProps {
  isOpen: boolean
  onConfirm: (serials: string[]) => Promise<void>
  onClose: () => void
}

const useStyles = makeStyles(() => createStyles({
  chip: {
    fontFamily: 'monospace',
    fontSize: '0.75rem',
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
          placeholder={translate('form.builder.serials.add.dialog.placeholder')}
          shouldAlwaysShowPlaceholder
          onChange={(_, value: string[]) => setSerials(value)}
          classes={{
            tag: classes.chip,
          }}
        />
      </div>
    </Dialog>
  );
};

export default withThemeNext(AddDialog);
