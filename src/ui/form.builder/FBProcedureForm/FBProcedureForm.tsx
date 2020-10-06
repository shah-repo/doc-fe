import { Box } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBAutocomplete, FBAutocompleteAsync, FBData, FBForm, FBProcedureFormProps, FBTextField } from "..";
import { FBQuantityField } from "../FBQuantityField";
import { FB } from "../helpers";
import { withFBProcedureForm } from "./FBProcedureForm.wrap";

const FBProcedureForm: React.FunctionComponent<FBProcedureFormProps> = ({
  formState,
  children,
  disabledOptions,
  optionId,
  type,
}) => (
  <FBForm {...{ formState }} >
    <FBTextField
      hidden={true}
      name="id"
      defaultValue={FB.uniqid}
    />
    <FBAutocompleteAsync
      name="title"
      label="form.builder.title"
      rules="required"
      {...{ optionId, disabledOptions }}
      freeSolo
    />
    {type === "materials" && (
      <Box display="flex">
        <Box width="50%" mr={1}>
          <FBQuantityField
            name="quantity"
            label="form.builder.quantity"
            rules="required"
          />
        </Box>
        <Box width="50%" ml={1}>
          <FBAutocomplete
            label="form.builder.unit"
            name="unit"
            options={FBData.unitsOptions}
            optionValueKey="value"
            optionLabelKey="text"
            rules="required"
          />
        </Box>
      </Box>
    )}
    {children}
  </FBForm>
);

export default withFBProcedureForm(FBProcedureForm);
