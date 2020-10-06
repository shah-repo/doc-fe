import React from "react";
import { FBPartsProps } from "..";
import FBPartsItem from "../FBPartsItem/FBPartsItem";
import { FBProvider } from "../FBProvider";
import { withFBParts } from "./FBParts.wrap";

const FBParts: React.FunctionComponent<FBPartsProps> = ({
  partsState,
  name,
}) => (
  <FBProvider {...{ partsState }}>
    <FBPartsItem type="materials" {...{ name }} />
    <FBPartsItem type="equipment" {...{ name }} />
  </FBProvider>
);

export default withFBParts(FBParts);
