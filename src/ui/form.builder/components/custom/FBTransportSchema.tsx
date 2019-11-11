import { Box } from "@material-ui/core";
import React from "react";
import { withTransport } from "../../hocs/withTransport";
import { FBTransportSchemaProps } from "../../types/transport";
import FBExportSchema from "./FBExportSchema";
import FBImportSchema from "./FBImportSchema";

const FBTransportSchema: React.FunctionComponent<FBTransportSchemaProps> = ({
  importSchema,
  ...props
}) => {
  return (
    <Box display="flex" flexDirection="row-reverse">
      <FBImportSchema importSchema={importSchema}  />
      <FBExportSchema {...props} />
    </Box>
  );
};

export default withTransport(FBTransportSchema);
