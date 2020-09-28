import React from "react";
import { FBFieldName, FBMapWrapper, FBPartsProps, FBProcedureItemConfig, FBSection } from "..";
import FBPartsItem from "../FBPartsItem/FBPartsItem";
import { withFBParts } from "./FBParts.wrap";

const FBParts: React.FunctionComponent<FBPartsProps> = ({
  equipment,
  materials,
  name,
}) => (
  <>
    <FBSection label="form.builder.materials" name={`${FBFieldName.MaterialSection}${name}`} />
    <FBMapWrapper<FBProcedureItemConfig[]> collection={materials}>
      {(material: FBProcedureItemConfig) => <FBPartsItem value={material} />}
    </FBMapWrapper>
    <FBSection label="form.builder.equipment" name={`${FBFieldName.EquipmentSection}${name}`}  />
    <FBMapWrapper<FBProcedureItemConfig[]> collection={equipment}>
      {(eq: FBProcedureItemConfig) => <FBPartsItem value={eq} />}
    </FBMapWrapper>
  </>
);

export default withFBParts(FBParts);
