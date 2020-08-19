import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBDocumentRevisionsFormProps, FBForm, FBTextField } from "..";

const FBDocumentRevisionsForm: React.FunctionComponent<FBDocumentRevisionsFormProps> = ({
  formState,
  disabledOptions,
  children,
}) => (
  <FBForm {...{ formState }} >
    <FBAutocompleteAsync
      name="proposedDocumentRevision"
      label="form.builder.document"
      placeholder="form.builder.select.document"
      optionId={FBAutocompleteAsyncOption.DRAFTdocumentRevisions}
      optionValueType="id"
      rules="required"
      {...{ disabledOptions }}
    />
    <FBTextField
      name="descriptionOfChange"
      label="form.builder.description.of.change"
      placeholder="form.builder.enter.text"
      rules="required"
      multiline={true}
      rows={3}
    />
    <FBTextField
      name="justificationOfChange"
      label="form.builder.justification.of.change"
      placeholder="form.builder.enter.text"
      rules="required"
      multiline={true}
      rows={3}
    />
    {children}
  </FBForm>
);

export default FBDocumentRevisionsForm;
