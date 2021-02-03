import React from "react";
import { FBFileDescriptionProps, FBFilePresenterIcon, FBForm, FBTextField } from "..";
import { withFBFileDescription } from "./FBFileDescription.wrap";

const FBFileDescription: React.FunctionComponent<FBFileDescriptionProps> = ({
  formState,
  children,
  ...props
}) =>  (
  <FBForm {...{ formState }}>
    <FBFilePresenterIcon {...props} />
    <FBTextField
      boxProps={{ mt: 2 }}
      name="description"
      placeholder="form.builder.add.description"
      rows={5}
    />
    {children}
  </FBForm>
);

export default withFBFileDescription(FBFileDescription);
