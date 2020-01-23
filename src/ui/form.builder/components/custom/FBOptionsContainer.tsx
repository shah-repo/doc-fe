import React from "react";
import Text from "../../../components/Text";
import FBTextField from "../inputs/FBTextField";

const FBOptionsContainer: React.FunctionComponent<{}> = () => (
  <Text message="form.builder.options.placeholder">
    {(placeholder) => (
      <Text message="form.builder.options.note">
        {(helperText) => (
          <FBTextField
            label="form.builder.options"
            name="options"
            rows={5}
            placeholder={placeholder as string}
            helperText={helperText}
          />
        )}
      </Text>
    )}
  </Text>
);

export default FBOptionsContainer;
