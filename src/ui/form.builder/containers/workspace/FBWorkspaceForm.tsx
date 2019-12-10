import React from "react";
import FBForm from "../../components/form/FBForm";
import FBStore from "../../stores/ui/FBStore";
import { FBWorkspaceProps } from "../../types/workspace";
import FBWorkspace from "./FBWorkspace";

const FBWorkspaceForm: React.FunctionComponent<FBWorkspaceProps> = ({
  values = FBStore.getValues() || {},
  ...props
}) => (
  <FBForm initialValues={values}>
    <FBWorkspace {...props} />
  </FBForm>
);

export default FBWorkspaceForm;
