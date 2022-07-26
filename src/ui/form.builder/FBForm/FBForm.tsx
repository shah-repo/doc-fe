import React from "react";
import { FBFormProps, FBProvider, FBSchema } from "..";
import { withFBForm } from "./FBForm.wrap";

const FBForm: React.FunctionComponent<FBFormProps> = ({
  children,
  formState,
  workspaceMode,
  schema,
  showAllTabs,
}) => (
  <FBProvider {...{ formState }}>
    {children}
    {schema && <FBSchema {...{ schema, showAllTabs, workspaceMode }} />}
  </FBProvider>
);

export default withFBForm(FBForm);
