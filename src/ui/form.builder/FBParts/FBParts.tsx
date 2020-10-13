import React from "react";
import { FBPartsItem, FBPartsProps, FBProcedureItemType, FBProvider } from "..";
import { withFBParts } from "./FBParts.wrap";

const FBParts: React.FunctionComponent<FBPartsProps> = ({
  partsState,
  name,
}) => (
  <FBProvider {...{ partsState }}>
    <FBPartsItem type={FBProcedureItemType.materials} {...{ name }} />
    <FBPartsItem type={FBProcedureItemType.equipment} {...{ name }} />
  </FBProvider>
);

export default withFBParts(FBParts);
