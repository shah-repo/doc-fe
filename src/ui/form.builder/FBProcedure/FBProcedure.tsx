import React from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FBInput, FBProcedureProps, FBSection } from "..";
import { withFBProcedure } from "./FBProcedure.wrap";

const FBProcedure: React.FunctionComponent<FBProcedureProps> = ({
  ...props
}) => (
  <FBInput {...props } type="procedure">
    <FBSection label="form.builder.procedure" gutter={false} />
  </FBInput>
);

export default withFBProcedure(FBProcedure);
