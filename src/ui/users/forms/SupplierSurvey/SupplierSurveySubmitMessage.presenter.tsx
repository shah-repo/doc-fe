import {
    Box,
  } from "@material-ui/core";
import * as React from "react";
import Text from "../../../components/Text";

const SupplierSurveySubmitMessage: React.FunctionComponent = () => {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        bgcolor="white"
        width="100%"
        height="100%"
        position="absolute"
      >
        <Text translation="supplier_survey_success_submit_message" />
      </Box>
    );
  };

export default SupplierSurveySubmitMessage;
