import { Box, Button } from "@material-ui/core";
import React from "react";
import InputField from "../../../components/forms/fields/Input";
import { required, validator } from "../../../components/forms/fields/validators";
import Text from "../../../components/Text";
import { styles } from "./ApiToken.style";

const GenerateTokenFormPresenter: React.FunctionComponent = () => {
  const classes = styles();
  return (
    <Box style={{
      display: "flex",
    }}>
      <Box className={classes.inputField}>
        <InputField
          type="text"
          name="name"
          inputProps={{ placeholder: "Enter Token Name", id: "ApiTokenContent-name" }}
          validate={validator(required)}
        />
      </Box>
      <Box style={{ paddingTop: 9 }}>
        <Button
          id="ApiTokenContent-generate"
          type="submit"
          color="primary"
          variant="contained"
        >
          <Text translation="user.management.generate.key" />
        </Button>
      </Box>
    </Box>
  );
};

export default GenerateTokenFormPresenter;
