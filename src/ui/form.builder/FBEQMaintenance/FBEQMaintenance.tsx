import { Box } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBEQMaintenanceHistory, FBFileUpload, FBInput, FBSelect, FBTextEditor, FBTextField } from "..";
import { FBSection } from "../FBSection";
import { FBEQMaintenanceProps } from "./FBEQMaintenance.types";
import { withFBEQMaintenance } from "./FBEQMaintenance.wrap";

const FBEQMaintenance: React.FunctionComponent<FBEQMaintenanceProps> = ({
  handleAdd,
  name,
  disabled,
  isNewPMDisabled,
  editorConfig = [],
  label,
  currentStatus,
  ...props
}) => (
  <FBInput {...{ name }} {...props} type="eqmaintenance">
    <FBSection
      {...{ label }}
      name={`${name}-section`}
    >
      <Box display="flex" flexDirection="row-reverse" mt={-3.5}>
        <FBButton
          variant="text"
          endIcon={<AddCircleIcon />}
          label="form.builder.new.pm"
          style={{ margin: 0 }}
          onClick={handleAdd}
          disabled={disabled || isNewPMDisabled}

        />
      </Box>
    </FBSection>
    <FBAutocompleteAsync
      label="form.builder.preventative.maintenance.form"
      optionId={FBAutocompleteAsyncOption.preventativeMaintenaceForms}
      name="preventativeMaintenanceForm"
      withState
      {...{ disabled }}
    />
    {/* This needs to be a number field */}
    <FBTextField
      name={`${name}.frequency`}
      label="form.builder.maintenance.frequency"
      withState
      {...{ disabled }}
    />
    {currentStatus && <Box mb={3}>
      <b>Current Status:</b> {currentStatus}
    </Box>}
    {editorConfig.includes("instructions") && (
      <FBTextEditor
        name={`${name}.instructions`}
        label="form.builder.pm.instructions"
        {...{ disabled }}
      />
    )}
    <FBEQMaintenanceHistory {...{ name }}/>
    {editorConfig.includes("manufacturer") && (
      <FBFileUpload
        name={`${name}.manufacturer`}
        label="form.builder.attach.manufacturer"
        {...{ disabled }}
      />
    )}
    {editorConfig.includes("specs") && (
      <FBSelect
        name={`${name}.specs`}
        label="form.builder.drawings.specs"
        {...{ disabled }}
      />
    )}
  </FBInput>
);
export default withFBEQMaintenance(FBEQMaintenance);
