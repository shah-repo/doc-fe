import { Box, Typography } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBAutocomplete, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBData, FBForm, FBProcedureFormProps, FBProcedureItemType, FBTextField } from "..";
import Text from "../../components/Text";
import { FBFileUpload } from "../FBFileUpload";
import { FBQuantityField } from "../FBQuantityField";
import { FB } from "../helpers";
import { withFBProcedureForm } from "./FBProcedureForm.wrap";


const FBProcedureForm: React.FunctionComponent<FBProcedureFormProps> = ({
  lotFilterOptions,
  partFilterOptions,
  formState,
  children,
  disabledOptions,
  initialValues,
  partLoading,
  lotLoading,
  optionId,
  type,
}) => (
  <FBForm {...{ formState, initialValues }} >
    <FBTextField
      hidden={true}
      name="id"
      defaultValue={FB.uniqid}
    />
    {type === FBProcedureItemType.materials &&
    <>
      <FBAutocompleteAsync
        name="title"
        label="form.builder.part"
        rules="required"
        optionId={FBAutocompleteAsyncOption.materials}
        filterOptions={lotFilterOptions}
        loading={partLoading}
        disabled={partLoading}
        {...{ disabledOptions }}
        freeSolo
        withState
      />
      <FBAutocompleteAsync
        name="partLot"
        label="form.builder.part.lot"
        optionId={FBAutocompleteAsyncOption.ebLots}
        filterOptions={partFilterOptions}
        loading={lotLoading}
        disabled={lotLoading}
        {...{ disabledOptions }}
        freeSolo
        withState
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
