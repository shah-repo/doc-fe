import { FormControl, FormHelperText } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import { includes, isEmpty } from "lodash";
import React from "react";
import { FBConditionalWrapper, FBFieldName, FBInputProps, FBInputState, FBLabel, FBTextField, OmitInputClones } from "..";
import Text from "../../components/Text";
import { withFBInput } from "./FBInput.wrap";

const FBInput: React.FunctionComponent<FBInputProps> = ({
  label,
  error,
  gutter = true,
  showErrorMsg = true,
  children,
  helperText = "",
  disabled,
  includeContext,
  boxProps,
  loading,
  type,
  hidden,
  name,
}) => (
  <>
    {!hidden && (
      <Box mb={gutter ? 5 : 0} {...boxProps}>
        <FBConditionalWrapper
          condition={type && !OmitInputClones.includes(type)}
          wrapper={(wrapperChildren) => (
            <FormControl fullWidth {...{ error }}>
              {!includes(FBInputState.omitLabel, type) && label && (
                <FBLabel {...{ error, label, loading }} />
              )}
              {wrapperChildren}
            </FormControl>
          )}
        >
          {children}
        </FBConditionalWrapper>
        {!isEmpty(helperText) && showErrorMsg && (
          <FormHelperText {...{ error }}>
            <Text message={helperText as string} />
          </FormHelperText>
        )}
        {includeContext && (
          <Box mt={type === "select" ? 3 : 0.5}>
            <FBTextField
              label="form.builder.note"
              {...{ disabled }}
              name={`${FBFieldName.Context}-${name}`}
              autosave
            />
          </Box>
        )}
      </Box>
    )}
  </>
);

export default withFBInput(FBInput);
