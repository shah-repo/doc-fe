import React from "react";
import { FBProvider, FBSchemaComponentProps } from "..";
import { withFBSchema } from "./FBSchema.wrap";

const FBSchema: React.FunctionComponent<FBSchemaComponentProps> = ({
  schemaState,
  children,
}) => <FBProvider {...{ schemaState }}>{children}</FBProvider>;

export default withFBSchema(FBSchema);
