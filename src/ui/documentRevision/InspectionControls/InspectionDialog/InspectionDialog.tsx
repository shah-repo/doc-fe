import { Button, Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import React from "react";
import { Formik, Form } from "formik";
import AutocompleteField from "../../../components/forms/fields/Autocomplete/Autocomplete";
import Text from "../../../components/Text";
import { InspectionDialogProps } from "../InspectionControls.types";
import { emptyFunction } from "../../../../common/utils/helpers";

/** For selecting a form and a document type of Inspection/FAI inspection record.
 * @param onFormSelect Action executed when user chooses a desired form.
 * @param onDocTypeSelect Action executed when user chooses a desired output document type based on the selected form.
 * @param inspectionDialog Dialog handler.
 * @param formOptions Available forms for the chosen inspection type.
 * @param docTypeOptions Available output document types for the chosen form.
 * @param isDocTypeInputDisabled Flag that marks whether user can choose a document type
 *            (should be disabled before a form is chosen)
 */
const InspectionDialog: React.FunctionComponent<InspectionDialogProps> = ({
  onFormSelect,
  onDocTypeSelect,
  inspectionDialog,
  formOptions,
  docTypeOptions,
  isDocTypeInputDisabled,
}) => {
  if (!inspectionDialog.isOpen) {
    return null;
  }

  return (
    <Dialog open={inspectionDialog.isOpen}>
      <DialogTitle>
        <Text translation="supplier.select.form" />
      </DialogTitle>
      <DialogContent>
        <Formik initialValues={{}} onSubmit={emptyFunction}>
          <Form>
            <AutocompleteField
              label="supplier.select.form"
              size="md"
              data-cy="inspection-form-autocomplete"
              options={formOptions}
              autocompleteProps={{ id: "inspection-form-autocomplete", maxMenuHeight: 130 }}
              name="inspection-form-autocomplete"
              onClick={(option) => onFormSelect(option.value, option.outputDocumentTypes)}
            />
            <AutocompleteField
              label="supplier.select.type"
              size="md"
              data-cy="inspection-type-autocomplete"
              options={docTypeOptions}
              autocompleteProps={{ id: "inspection-type-autocomplete", maxMenuHeight: 90 }}
              name="inspection-type-autocomplete"
              onClick={(option) => onDocTypeSelect(option.value, option.formId)}
              isDisabled={isDocTypeInputDisabled}
            />
            <Button
              variant="text"
              color="secondary"
              onClick={inspectionDialog.close}
              id="DocTypeListDialog-cancelButton"
              data-cy="inspection-tye-cancel"
            >
              <Text translation="transition.action.cancel" />
            </Button>
          </Form>
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default InspectionDialog;
