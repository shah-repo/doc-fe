import { Box, Button, Typography } from "@material-ui/core";
import { Form, Formik } from "formik";
import React from "react";
import InputField from "../../../components/forms/fields/Input";
import Text from "../../../components/Text";
import { styles } from "./UserGroups.style";

export const ApiTokenContent: React.FunctionComponent = () => {
  const classes = styles();
  const renderForm = () => (
    <Form>
      <Box>
        <InputField
          type="string"
          className={classes.inputField}
          name="apiToken"
        />
        <Button
          id="ApiTokenContent-generate"
          type="submit"
          color="primary"
          variant="contained"
        >
          <Typography variant="h6">
            <Text translation="user.management.generate.key" />
          </Typography>
        </Button>
      </Box>
    </Form>
  );

  const renderInputForm = () => (
    <Formik
      onSubmit={() => console.log("here")}
      initialValues={[]}
    >
      {renderForm}
    </Formik>
  );

  return (
    <Box alignSelf="center" mt={7}>
      <Typography variant="h6">
        <Text translation="user.management.api.token" />
      </Typography>
      {renderInputForm()}
    </Box>
  );
};

export default ApiTokenContent;
