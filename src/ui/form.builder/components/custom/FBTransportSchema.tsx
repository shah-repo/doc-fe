import React from "react";
import { withTransport } from "../../hocs/withTransport";
import { FBTransportSchemaProps } from "../../types/transport";
import FBExportSchema from "./FBExportSchema";
import FBImportSchema from "./FBImportSchema";

const FBTransportSchema: React.FunctionComponent<FBTransportSchemaProps> = ({
  importSchema,
  ...props
}) => (
  <>
    <FBImportSchema importSchema={importSchema} />
    <FBExportSchema {...props} />
  </>
);

export default withTransport(FBTransportSchema);
