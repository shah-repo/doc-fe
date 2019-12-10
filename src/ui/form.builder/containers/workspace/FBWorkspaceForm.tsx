import React from "react";
import { FBWorkspaceProps } from "../../types/workspace";
import FBForm from "../../components/form/FBForm";
import FBWorkspace from "./FBWorkspace";
import FBStore from "../../stores/ui/FBStore";

const FBWorkspaceForm: React.FunctionComponent<FBWorkspaceProps> = ({
  values = FBStore.getValues() || {},
  ...props
}) => (
  <FBForm initialValues={values}>
    <FBWorkspace {...props} />
  </FBForm>
);

export default FBWorkspaceForm;
