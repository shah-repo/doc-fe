import { Box, List, ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import { LiveEditor, LiveError, LiveProvider } from "react-live";
import { withValidatorCustom } from "../../hocs/validation/withValidatorCustom";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
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
    <FBTextField label="Error Message" name="custom-validator-error-message" />
    <List subheader={<li />}>
      {
        <li>
          Fields:
          <ul>
            {FBValidatorStore.getFieldNames().map((item) => (
              <ListItem style={{ padding: 0 }} key={`item-${item}`}>
                <ListItemText primary={`${item}`} />
              </ListItem>
            ))}
          </ul>
        </li>
      }
    </List>
    <LiveProvider code={code} scope={scope} transformCode={transformCode}>
      <Box bgcolor="black">
        <LiveEditor />
      </Box>
      <LiveError />
    </LiveProvider>
    <Box display="flex" flexDirection="row-reverse" mx={-1}>
      <FBButton label="Clear" onClick={clear} />
    </Box>
  </Box>
);

export default withValidatorCustom(FBValidatorCustom);
