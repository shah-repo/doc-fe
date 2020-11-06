import { Box } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBCheckboxGroup, FBData, FBEQMaintenanceHistory, FBFileUpload, FBInput, FBSelect, FBTextEditor, FBTextField } from "..";
import { FBSection } from "../FBSection";
import { FBEQMaintenanceProps } from "./FBEQMaintenance.types";
import { withFBEQMaintenance } from "./FBEQMaintenance.wrap";

const FBEQMaintenance: React.FunctionComponent<FBEQMaintenanceProps> = ({
  handleAdd,
  name,
  disabled,
  isNewPMDisabled,
  ...props
}) => (
  <FBInput {...{ name }} {...props} type="eqmaintenance">
    <FBSection
      label={"form.builder.preventative.maintenance"}
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
    <FBCheckboxGroup
      label="form.builder.eft.requirements"
      name={`${name}.requirements`}
      options={FBData.yesNoOptions}
      applicableValidationSchema
      {...{ disabled }}
    />
    <FBAutocompleteAsync
      label="form.builder.preventative.maintenance.form"
      optionId={FBAutocompleteAsyncOption.preventativeMaintenaceForms}
      name="preventativeMaintenanceForm"
      validationMode="visibility"
      rules={`required_if_in:${name}.requirements,Yes`}
      withState
      {...{ disabled }}
    />
    {/* This needs to be a number field */}
    <FBTextField
      name={`${name}.frequency`}
      label="form.builder.maintenance.frequency"
      rules={`required_if_in:${name}.requirements,Yes`}
      validationMode="visibility"
      withState
      {...{ disabled }}
    />
    <FBTextEditor
      name={`${name}.instructions`}
      label="form.builder.pm.instructions"
      rules={`required_if_in:${name}.requirements,Yes`}
      validationMode="visibility"
      {...{ disabled }}
    />
    <FBEQMaintenanceHistory {...{ name }}/>
    <FBFileUpload
      name={`${name}.manufacturer`}
      label="form.builder.attach.manufacturer"
      rules={`required_if_in:${name}.requirements,Yes,No`}
      validationMode="visibility"
      {...{ disabled }}
    />
    <FBSelect
      name={`${name}.specs`}
      label="form.builder.drawings.specs"
      rules={`required_if_in:${name}.requirements,Yes,No`}
      validationMode="visibility"
      gutter={false}
      {...{ disabled }}
    />
  </FBInput>
);
export default withFBEQMaintenance(FBEQMaintenance);
