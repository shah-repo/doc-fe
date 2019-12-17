import { Box } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { LiveEditor, LiveError, LiveProvider } from "react-live";
import { withValidatorCustom } from "../../hocs/validation/withValidatorCustom";
import FBStore from "../../stores/ui/FBStore";
import { FBValidatorCustomProps } from "../../types/validation/validatorDialog";
import FBButton from "../inputs/FBButton";
import FBTextField from "../inputs/FBTextField";

const FBValidatorCustom: React.FunctionComponent<FBValidatorCustomProps> = ({
  code,
  scope,
  transformCode,
  clear,
}) => (
  <Box>
    {_.map(FBStore.getSchema(), (schemaItem) => {
      return (
        <Box>
          {schemaItem.type === "checkboxgroup" &&
            _.map(
              _.split((schemaItem.options || "") as string, "\n"),
              (option) => {
                return (
                  <Box borderBottom={1} py={1}>
                    <Box>Field: {option}</Box>
                    <Box>
                      Field name:{" "}
                      {`${_.toLower(option).replace(" ", "_")}_${
                        schemaItem.name
                      }`}
                    </Box>
                  </Box>
                );
              },
            )}
          {schemaItem.type === "radiogroup" && (
            <Box borderBottom={1} py={1}>
              <Box>Field: {schemaItem.label}</Box>
              <Box>Field name: {schemaItem.name}</Box>
              <Box>
                Field option values:{" "}
                {_.map(
                  _.split((schemaItem.options || "") as string, "\n"),
                  (option) => {
                    return (
                      <Box>
                        <Box pl={1}>
                          {`${_.toLower(option).replace(" ", "_")}_${
                            schemaItem.name
                          }`}
                        </Box>
                      </Box>
                    );
                  },
                )}
              </Box>
            </Box>
          )}
          {schemaItem.type !== "radiogroup" &&
            schemaItem.type !== "checkboxgroup" && (
              <Box borderBottom={1} py={1}>
                <Box>Field: {schemaItem.label}</Box>
                <Box>Field name: {schemaItem.name}</Box>
              </Box>
            )}
        </Box>
      );
    })}
    <LiveProvider code={code} scope={scope} transformCode={transformCode}>
      <Box bgcolor="black">
        <LiveEditor />
      </Box>
      <LiveError />
    </LiveProvider>
    <Box mt={5}>
      <FBTextField
        label="Error Message"
        name="custom-validator-error-message"
      />
    </Box>
    <Box display="flex" flexDirection="row-reverse" mx={-1}>
      <FBButton label="Clear" onClick={clear} />
    </Box>
  </Box>
);

export default withValidatorCustom(FBValidatorCustom);
