import Box from "@material-ui/core/Box/Box";
import React from "react";
import { withValidator } from "../../hocs/validation/withValidator";
import { FBValidatorProps } from "../../types/validation/validator";
import FBLabel from "../common/FBLabel";
import FBCheckbox from "../inputs/FBCheckbox";

const FBValidator: React.FunctionComponent<FBValidatorProps> = ({
  name,
  description,
  afterChange,
  // onChange,
  index,
  indicatorElements,
  pattern,
}) => (
  <Box>
    <FBLabel label={`${index}.  ${description}`} mb={2} />
    <FBCheckbox
      name={name}
      label={pattern}
      afterChange={afterChange}
    />
    {/* <FBLabel label="Custom triggers" fontSize="sm" mt={-3.5} />
    <FBCheckboxGroup
      name="applicableOn"
      options={FBValidatorStore.triggers()}
      afterChange={afterChange}
    /> */}
    {indicatorElements}
  </Box>
);

export default withValidator(FBValidator);
