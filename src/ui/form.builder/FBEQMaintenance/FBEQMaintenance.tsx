import { Box } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React from "react";
import { FBAutocomplete, FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBCheckboxGroup, FBData, FBEQMaintenanceHistory, FBFileUpload, FBInput, FBSelect, FBTextEditor } from "..";
import { FBSection } from "../FBSection";
import { FBEQMaintenanceProps } from "./FBEQMaintenance.types";
import { withFBEQMaintenance } from "./FBEQMaintenance.wrap";

const FBEQMaintenance: React.FunctionComponent<FBEQMaintenanceProps> = ({
  handleAdd,
  name,
  disabled,
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
          {...{ disabled }}
        />
      </Box>
    </FBSection>
    <FBCheckboxGroup
      label="form.builder.eft.requirements"
      name={`${name}-etf-checkbox`}
      options={FBData.yesNoOptions}
      {...{ disabled }}
    />
    <FBAutocompleteAsync
      label="form.builder.preventative.maintenance.form"
      optionId={FBAutocompleteAsyncOption.preventativeMaintenaceForms}
      name="preventativeMaintenanceForm"
      withState
      {...{ disabled }}
    />
    <FBAutocomplete
      name={`${name}-frequency`}
      label="form.builder.maintenance.frequency"
      {...{ disabled }}
    />
    <FBTextEditor
      name={`${name}-pm-instructions`}
      label="form.builder.pm.instructions"
      {...{ disabled }}
    />
    <FBEQMaintenanceHistory />
    <FBFileUpload
      name={`${name}-attach-manufacturer`}
      label="form.builder.attach.manufacturer"
      {...{ disabled }}
    />
    <FBSelect
      name={`${name}-drawings-specs`}
      label="form.builder.drawings.specs"
      gutter={false}
      {...{ disabled }}
    />
  </FBInput>
);
export default withFBEQMaintenance(FBEQMaintenance);
