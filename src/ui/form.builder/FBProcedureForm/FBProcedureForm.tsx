import { Box } from "@material-ui/core";
import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FB, FBAutocomplete, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBCheckbox, FBData, FBFileUpload, FBForm, FBProcedureFormProps, FBProcedureItemType, FBQuantityField, FBTextField } from "..";
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
  mode = "eb",
  type,
  disabled,
  isDocumentMPI,
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
        freeSolo={mode !== "lhr"}
        withState
        shouldReloadOnInit
      />
      {mode !== "mpi" && mode !== "lhr" && (
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
      )}
    </>
    }
    {type === FBProcedureItemType.equipment &&
    <FBAutocompleteAsync
      name="title"
      label="form.builder.title"
      rules="required"
      {...{ optionId, disabledOptions }}
      freeSolo={mode !== "lhr"}
    />
    }
    {isDocumentMPI && <FBCheckbox
      name="LHRTparameter"
      label="form.builder.lhrt.parameter"
      withState
    />}
    {type === FBProcedureItemType.materials && (
      <>
        <Box display="flex">
          <Box width="50%" mr={1}>
            <FBQuantityField
              name="quantity"
              label="form.builder.quantity"
              {...{ disabled }}
            />
          </Box>
          <Box width="50%" ml={1}>
            <FBAutocomplete
              label="form.builder.unit"
              name="unit"
              options={FBData.unitsOptions}
              optionValueKey="value"
              optionLabelKey="text"
              {...{ disabled }}
            />
          </Box>
        </Box>
        {mode !== "mpi" && mode !== "lhr" && (
          <FBFileUpload label="form.builder.attachments" name="attachments" />
        )}
      </>
    )}
    {children}
  </FBForm>
);

export default withFBProcedureForm(FBProcedureForm);
