import { Box } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBEQMaintenanceHistory, FBInput, FBQuantityField, FBTextEditor } from "..";
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
  isTypePM,
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
          disabled={isNewPMDisabled}
        />
      </Box>
    </FBSection>
    <FBAutocompleteAsync
      label={isTypePM ? "form.builder.preventative.maintenance.form" : "form.builder.calibration.form"}
      optionId={FBAutocompleteAsyncOption.preventativeMaintenaceForms}
      name={`${name}.preventativeForm`}
      withState
      {...{ disabled }}
    />
    <FBQuantityField
      name={`${name}.frequency`}
      label={isTypePM ? "form.builder.maintenance.frequency" : "form.builder.calibration.frequency"}
      withState
      {...{ disabled }}
    />
    {currentStatus && <Box mb={3}>
      <b>Current Status:</b> {currentStatus}
    </Box>}
    {editorConfig?.fields?.includes("instructions") && (
      <FBTextEditor
        name={`${name}.instructions`}
        label="form.builder.pm.instructions"
        {...{ disabled }}
      />
    )}
    <FBEQMaintenanceHistory {...{ name }}/>
  </FBInput>
);
export default withFBEQMaintenance(FBEQMaintenance);
