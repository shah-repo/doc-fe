import { Box } from '@material-ui/core';
import React from 'react';
import Dialog from '../../../components/dialogs';
import AutocompleteField from '../../../components/forms/fields/Autocomplete/Autocomplete';
import { DialogHandler } from '../../../hooks/useDialog';

interface FormSelectionDialogProps {
  dialog: DialogHandler
  formIds: any
}

const FormSelectionDialog: React.FunctionComponent<FormSelectionDialogProps> = ({
  dialog,
  formIds,
}) => {
  const renderOptions = () => {
    return formIds.map((form) => ({
      label: form.name,
      value: form.id,
    }));
  };

  return (
    <Dialog
      open={dialog.isOpen}
      cancelLabel={'transition.action.cancel'}
      onCancel={() => dialog.close()} >
      <Box>
      <AutocompleteField
                    // isDisabled={areFormIdsLoading}
                    name="selectForm"
                    size="sm"
                    autocompleteProps={{ id: 'MultipleFormTemplate-selectDocType' }}
                    options={renderOptions()}
                    // onClick={(option) => handleTemplateSelection?.(option.value)}
                    label={'supplier.select.form'}
                  />
                  {/* <Button
                  variant="text"
                  color="secondary"
                  className={classes.cancelButton}
                  onClick={closeMultipleFormDialog}
                  id="DocTypeListDialog-cancelButton"
                  data-cy="suggestFormCancelBtn"
                >
                  <Text translation="transition.action.cancel" />
                </Button> */}
      </Box>
    </Dialog>
  );
};

export default FormSelectionDialog;
