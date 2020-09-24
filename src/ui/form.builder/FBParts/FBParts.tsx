import React from "react";
import { FBMapWrapper, FBPartsProps, FBProcedureItemConfig, FBSection } from "..";
import FBPartsItem from "../FBPartsItem/FBPartsItem";
import { withFBParts } from "./FBParts.wrap";

const FBParts: React.FunctionComponent<FBPartsProps> = ({
  equipment,
  materials,
  ...props
}) => (
  <>
    <FBSection label="form.builder.materials" />
    <FBMapWrapper<FBProcedureItemConfig[]> collection={materials}>
      {(material: FBProcedureItemConfig) => <FBPartsItem value={material} />}
    </FBMapWrapper>
    <FBSection label="form.builder.equipment" />
    <FBMapWrapper<FBProcedureItemConfig[]> collection={equipment}>
      {(eq: FBProcedureItemConfig) => <FBPartsItem value={eq} />}
    </FBMapWrapper>
  </>
);

export default withFBParts(FBParts);
