import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBForm, FBSupplierFormProps, FBTextEditor, FBTextField } from "..";
import { withFBSupplierForm } from "./FBSupplierForm.wrap";

const FBSupplierForm: React.FunctionComponent<FBSupplierFormProps> = ({
  children,
  formState,
  loading,
  disabled,
  formOptions,
  formAutocompleteDisabled,
}) => (
  <FBForm {...{ formState }}>
    <FBTextField
      rules="required"
      name="name"
      label="form.builder.title"
      {...{ disabled }}
    />
    <FBTextEditor
      rules="required"
      name="description"
      label="form.builder.field.description"
      {...{ disabled }}
    />
    <FBAutocompleteAsync
      rules="required"
      label="document.type"
      optionId={FBAutocompleteAsyncOption.supplierDocumentTypes}
      name="document.documentType.id"
      withState
      {...{ loading, disabled }}
    />
    <FBAutocompleteAsync
      name="formDocument.id"
      label="form.builder.choose.form"
      rules="required"
      options={formOptions}
      optionValueKey="id"
      optionLabelKey="name"
      disabled={disabled || formAutocompleteDisabled}
      {...{ loading }}
    />
    <FBTextField hidden name="revisionStage" defaultValue={1} />
    <FBTextField hidden name="document.docId" />
    <FBTextField hidden name="document.securityList" defaultValue={[]} />
    <Box display="flex" justifyContent="center" mx={0}>
      {children}
    </Box>
  </FBForm>
);

export default withFBSupplierForm(FBSupplierForm);
