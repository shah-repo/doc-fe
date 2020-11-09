import React from "react";
import { FBInput, FBPartsItem, FBPartsProps, FBProcedureItemType, FBProvider } from "..";
import { withFBParts } from "./FBParts.wrap";

const FBParts: React.FunctionComponent<FBPartsProps> = ({
  partsState,
  name,
  gutter,
}) => (
  <FBProvider {...{ partsState }}>
    <FBInput {...{ name, gutter }} type="parts">
      <FBPartsItem type={FBProcedureItemType.materials} {...{ name }} gutter={true} />
      <FBPartsItem type={FBProcedureItemType.equipment} {...{ name }} gutter={false} />
    </FBInput>
  </FBProvider>
);

export default withFBParts(FBParts);
