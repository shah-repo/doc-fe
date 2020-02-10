import { Box } from "@material-ui/core";
import React from "react";
import { FBHelloSignProps } from ".";
import FBInput from "../components/common/FBInput";
import FBButton from "../components/inputs/FBButton";
import FBFileUpload from "../components/navigation/FBFileUpload";
import { withFBHelloSign } from "./FBHelloSign.wrap";

const FBHelloSign: React.FunctionComponent<FBHelloSignProps> = ({
  onClick,
  ...props
}) => (
  <Box>
    <FBInput {...props} disabled={false} fullWidth={false}>
      <FBButton label="form.builder.create.template" {...{onClick}} />
    </FBInput>
    <FBFileUpload name="files" />
  </Box>
);

export default withFBHelloSign(FBHelloSign);
