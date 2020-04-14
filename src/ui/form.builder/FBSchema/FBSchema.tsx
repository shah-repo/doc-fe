import React from "react";
import { FBSchemaComponentProps } from ".";
import { FBProvider } from "..";
import { withFBSchema } from "./FBSchema.wrap";

const FBSchema: React.FunctionComponent<FBSchemaComponentProps> = ({
  schemaState,
  children,
}) => <FBProvider {...{ schemaState }}>{children}</FBProvider>;

export default withFBSchema(FBSchema);
