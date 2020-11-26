import { Box } from "@material-ui/core";
import React from "react";
import { FBPassValueProps } from ".";
import { FBAutocomplete, FBForm, FBRange, FBTextField } from "..";
import { withFBPassValue } from "./FBPassValue.wrap";

const FBPassValue: React.FunctionComponent<FBPassValueProps> = ({
  isTypePercentage,
  formState,
  ...props
}) => (
  <FBForm { ...{ formState }}>
    <Box display="flex" alignItems="flex-end">
      <Box>
        {
          isTypePercentage ? (
            <FBTextField />
          ) : (
            <FBRange name="range" />
          )
        }
      </Box>
      <Box flexGrow={1}>
        <FBAutocomplete
          withState
          name="typeOfPassValue"
          defaultValue="value"
          options={[
            {
              text: "Percentage",
              value: "percentage",
            },
            {
              text: "Value",
              value: "value",
            },
          ]}
        />
      </Box>
    </Box>
    <Box display="flex">
      <Box marginRight={1}>
        <FBTextField type="number" placeholder="+ 00" name="plus"/>
      </Box>
      <Box>
        <FBTextField type="number" placeholder="- 00" name="minus"/>
      </Box>
    </Box>
  </FBForm>
);

export default withFBPassValue(FBPassValue);
