import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import React from "react";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import Text from "../../../components/Text";
import { InspectionDialogProps } from "../InspectionControls.types";

export const InspectionDialog: React.FunctionComponent<InspectionDialogProps> = ({
  onFormSelect,
  onDocTypeSelect,
  inspectionDialog,
  formOptions,
  docTypeOptions,
  isDocTypeInputDisabled,
}) => (
  <Dialog open={inspectionDialog.isOpen}>
    <DialogTitle>
      <Text translation="supplier.select.form" />
    </DialogTitle>
    <DialogContent>
      <AutocompleteField
        label="supplier.select.form"
        size="md"
        data-cy="inspection-form-autocomplete"
        options={formOptions}
        autocompleteProps={{ id: "inspection-form-autocomplete" }}
        name="inspection-form-autocomplete"
        onClick={(option) => onFormSelect(option.value, option.outputDocumentTypes)}
      />
      <AutocompleteField
        label="supplier.select.type"
        size="md"
        data-cy="inspection-type-autocomplete"
        options={docTypeOptions}
        autocompleteProps={{ id: "inspection-type-autocomplete" }}
        name="inspection-type-autocomplete"
        onClick={(option) => onDocTypeSelect(option.value, option.formId)}
        isDisabled={isDocTypeInputDisabled}
      />
    </DialogContent>
  </Dialog>
);

export default InspectionDialog;
