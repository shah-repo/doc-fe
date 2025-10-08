import { createStyles, makeStyles } from '@material-ui/styles';
import React from 'react';
import Dialog from '../../../components/dialogs';
import AutocompleteField from '../../../components/forms/fields/Autocomplete/Autocomplete';
import { DialogHandler } from '../../../hooks/useDialog';

const useStyles = makeStyles(() =>
  createStyles({
    dialogContent: {
      overflowY: 'unset',
    },
  }));

interface FormSelectionDialogProps {
  dialog: DialogHandler
  formIds: any
  onFormSelection: (option) => void
}

const FormSelectionDialog: React.FunctionComponent<FormSelectionDialogProps> = ({
  dialog,
  formIds,
  onFormSelection,
}) => {
  const classes = useStyles();
  const renderOptions = () => {
    return formIds.map((form) => ({
      label: form.name,
      id: form.id,
    }));
  };

  return (
    <Dialog
      open={dialog.isOpen}
      fullWidth
      maxWidth="xs"
      cancelLabel={'transition.action.cancel'}
      onCancel={dialog.close}
      onClose={dialog.close}
      contentProps={{ className: classes.dialogContent }} >
      <AutocompleteField
        name="selectForm"
        size="sm"
        autocompleteProps={{ id: 'MultipleFormTemplate-selectDocType' }}
        options={renderOptions()}
        onClick={onFormSelection}
        label={'supplier.select.form'}
      />
    </Dialog>
  );
};

export default FormSelectionDialog;
