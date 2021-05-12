import { Box, Button } from "@material-ui/core";
import React from "react";
import { ReactComponent as CopyIcon } from "../../../../assets/images/copy.svg";
import InputField from "../../../components/forms/fields/Input";
import Text from "../../../components/Text";
import { styles } from "./ApiToken.style";

interface Props {
  apiTokenKey: string;
  apiTokenSecret: string;
}

const ApiTokenResponseFormPresenter: React.FunctionComponent<Props> = ({
  apiTokenKey,
  apiTokenSecret,
}) => {
  const classes = styles();
  return (
    <Box>
      <InputField
        name="name"
        label="common.name"
        inputProps={{ id: "ApiTokenDialog-name", disabled: true }}
      />
      <div>
        <Button
          className={classes.copyKeyButton}
          color="primary"
          id="ApiTokenDialog-copyKey"
          onClick={() => navigator.clipboard?.writeText(apiTokenKey)}>
          <CopyIcon className={classes.icon} />
          <Text translation="api.token.copy.key" />
        </Button>
        <InputField
          name="key"
          label="api.token.key"
          inputProps={{ id: "ApiTokenDialog-key", disabled: true }}
        />
      </div>
      <div>
        <Button
          className={classes.copySecretButton}
          color="primary"
          id="ApiTokenDialog-copySecret"
          onClick={() => navigator.clipboard?.writeText(apiTokenSecret)}>
          <CopyIcon className={classes.icon} />
          <Text translation="api.token.copy.secret" />
        </Button>
        <InputField
          name="secret"
          label="api.token.secret"
          inputProps={{ id: "ApiTokenDialog-secret", disabled: true }}
        />
      </div>
    </Box>
  );
};

export default ApiTokenResponseFormPresenter;
