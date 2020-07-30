import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBTextField } from "../..";
import { FormContext } from "../../../components/forms/FormContext";
import { FBDocumentRevisionFormProps } from "../FBDocumentRevisions.types";
import { withFBDocumentRevisionForm } from "./FBDocumentRevisionForm.wrap";

const FBDocumentRevisionForm: React.FunctionComponent<FBDocumentRevisionFormProps> = ({
  getOptionDisabled,
}) => (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <FBAutocompleteAsync
        label="Proposed document revision"
        optionId={FBAutocompleteAsyncOption.documentRevisions}
        name="proposedDocumentRevision"
        placeholder="Select"
        optionValueType="id"
        rules="required"
        {...{ getOptionDisabled }}
      />
      <FBTextField
        label="form.builder.description.of.change"
        name="descriptionOfChange"
        rules="required"
        multiline={true}
        rows={3}
        placeholder="form.builder.enter.text"
      />
      <FBTextField
        type="textfield"
        label="form.builder.justification.of.change"
        multiline={true}
        rows={3}
        name="justificationOfChange"
        rules="required"
        placeholder="form.builder.enter.text"
      />
    </ FormContext.Provider>
  );

export default withFBDocumentRevisionForm(FBDocumentRevisionForm);
