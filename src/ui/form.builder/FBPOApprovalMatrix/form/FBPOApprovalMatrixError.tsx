import { Box, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";

interface ErrorProps { error?: string }
const FBPOApprovalMatrixError: React.FunctionComponent<ErrorProps> = ({
  error,
}) => {
  if (!error) {
    return null;
  }

  return (
    <Box marginTop="-30px" marginBottom="10px">
      <Typography color="error" variant="subtitle2" >
        <Text message={error} />
      </Typography>
    </Box>
  );
};

export default FBPOApprovalMatrixError;
