import { Box, Typography } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBAutocomplete, FBAutocompleteAsync, FBData, FBForm, FBProcedureFormProps, FBTextField } from "..";
import Text from "../../components/Text";
import { FBFileUpload } from "../FBFileUpload";
import { FBProcedureItemType } from "../FBProcedureItem";
import { FBQuantityField } from "../FBQuantityField";
import { FB } from "../helpers";
import { withFBProcedureForm } from "./FBProcedureForm.wrap";


const FBProcedureForm: React.FunctionComponent<FBProcedureFormProps> = ({
  formState,
  children,
  disabledOptions,
  initialValues,
  optionId,
  type,
  lotOptions,
  partOptions,
  disabled,
}) => (
  <FBForm {...{ formState, initialValues }} >
    <FBTextField
      hidden={true}
      name="id"
      defaultValue={FB.uniqid}
    />
    {type === FBProcedureItemType.materials &&
    <>
      <FBAutocomplete
        name="title"
        label="form.builder.part"
        rules="required"
        {...{ disabledOptions }}
        options={partOptions}
        freeSolo
        withState
        {...{ disabled }}
      />
      <FBAutocomplete
        name="partLot"
        label="form.builder.part.lot"
        {...{ disabledOptions }}
        options={lotOptions}
        withState
        {...{ disabled }}
      />
    </>
    }
    {type === FBProcedureItemType.equipment &&
    <FBAutocompleteAsync
      name="title"
      label="form.builder.title"
      rules="required"
      {...{ optionId, disabledOptions }}
      freeSolo
    />
    }
    {type === FBProcedureItemType.materials && (
      <>
        <Box display="flex">
          <Box width="50%" mr={1}>
            <FBQuantityField
              name="quantity"
              label="form.builder.quantity"
            />
          </Box>
          <Box width="50%" ml={1}>
            <FBAutocomplete
              label="form.builder.unit"
              name="unit"
              options={FBData.unitsOptions}
              optionValueKey="value"
              optionLabelKey="text"
            />
          </Box>
        </Box>
        <Typography variant="h6" style={{ marginBottom: 16 }} >
          <Text message="common.attachments"/>
        </Typography>
        <FBFileUpload name="attachments" />
      </>
    )}
    {children}
  </FBForm>
);

export default withFBProcedureForm(FBProcedureForm);
