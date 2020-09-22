import React from "react";
import { withFBParts } from "./FBParts.wrap";

const FBParts: React.FunctionComponent<any> = ({
  ...props
}) => (
  <div>Hello world</div>
);

export default withFBParts(FBParts);
