import Box from "@material-ui/core/Box/Box";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import React from "react";
import { withValidatorOption } from "../../hocs/validation/withValidatorOption";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBValidatorOptionProps } from "../../types/validation/validatorOption";
import FBCheckboxGroup from "../inputs/FBCheckboxGroup";

const FBValidatorOption: React.FunctionComponent<FBValidatorOptionProps> = ({
  name,
  description,
  onChange,
  checked,
  indicatorElements,
  pattern,
}) => (
  <Box mb={3} pt={2} px={3} borderBottom={1}>
    <FormControlLabel
      label={pattern}
      name={name}
      control={<Checkbox onChange={onChange} />}
    />
    <Box mb={2.5} fontSize="body2.fontSize">
      {description}
    </Box>
    {checked && indicatorElements}
    <FBCheckboxGroup
      name={`applicableOn-${name}`}
      options={FBValidatorStore.triggers()}
    />
  </Box>
);

export default withValidatorOption(FBValidatorOption);
