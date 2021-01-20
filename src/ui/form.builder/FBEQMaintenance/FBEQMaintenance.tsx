import { Box } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBData, FBEQMaintenanceHistory, FBInput, FBQuantityField, FBRadioGroup, FBText, FBTextEditor } from "..";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import { FBSection } from "../FBSection";
import { FBEQMaintenanceProps } from "./FBEQMaintenance.types";
import { withFBEQMaintenance } from "./FBEQMaintenance.wrap";

const FBEQMaintenance: React.FunctionComponent<FBEQMaintenanceProps> = ({
  handleAdd,
  complianceDueDate,
  complianceStatus,
  name,
  disabled,
  isNewPMDisabled,
  editorConfig = [],
  label,
  isTypePM,
  rules,
  ...props
}) => (
  <FBInput showErrorMsg={false} {...{ name, rules }} {...props} type="eqmaintenance">
    <FBSection
      {...{ label }}
      name={`${name}-section`}
    >
      <Box display="flex" flexDirection="row-reverse">
        <FBButton
          variant="text"
          endIcon={<AddCircleIcon />}
          label={isTypePM ? "form.builder.new.pm" : "form.builder.new.calibration"}
          style={{ margin: 0 }}
          onClick={handleAdd}
          disabled={isNewPMDisabled}
        />
      </Box>
    </FBSection>
    <FBRadioGroup
      label={isTypePM ? "form.builder.pm.required" : "form.builder.calibration.required"}
      name={`${name}.requirements`}
      options={FBData.yesNoOptions}
      rules="required"
      {...{ disabled }}
    />
    <FBAutocompleteAsync
      label={isTypePM ? "form.builder.preventative.maintenance.form" : "form.builder.calibration.form"}
      optionId={FBAutocompleteAsyncOption.preventativeMaintenaceForms}
      name={`${name}.preventativeForm`}
      validationMode="visibility"
      rules={`required_if:${name}.requirements,Yes`}
      withState
      {...{ disabled }}
    />
    <FBQuantityField
      name={`${name}.frequency`}
      label={isTypePM ? "form.builder.maintenance.frequency" : "form.builder.calibration.frequency"}
      validationMode="visibility"
      rules={`required_if:${name}.requirements,Yes`}
      withState
      placeholder="form.builder.units.days"
      {...{ disabled }}
    />
    <FBTextEditor
      name={`${name}.justification`}
      label="common.justifications"
      validationMode="visibility"
      rules={`required_if:${name}.requirements,No`}
      {...{ disabled }}
    />
    <FBTextEditor
      name={`${name}.instructions`}
      label="form.builder.pm.instructions"
      validationMode="visibility"
      rules={`required_if:${name}.requirements,Yes`}
      {...{ disabled }}
    />
    <FBEQMaintenanceHistory {...{ name }}/>
    {complianceDueDate &&
      <Box mb={3} data-cy="maintenance.status">
        <FBText
          boxProps={{ fontWeight: "fontWeightBold", mb: 2 }}
          locale={"form.builder.current.status"}
        />
        {complianceStatus}
        <span> - Due Date: </span>
        {getFormattedDateString(complianceDueDate, MomentFormats.MonthDateYearAlt)}
      </Box>
    }
  </FBInput>
);
export default withFBEQMaintenance(FBEQMaintenance);
