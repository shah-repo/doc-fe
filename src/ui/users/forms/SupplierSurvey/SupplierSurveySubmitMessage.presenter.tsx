import {
    Box,
  } from "@material-ui/core";
import * as React from "react";

interface Props  {
    message: string;
}

const SupplierSurveySubmitMessage: React.FunctionComponent<Props> = ({message}) => {
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
        {message}
      </Box>
    );
  };

export default SupplierSurveySubmitMessage;
