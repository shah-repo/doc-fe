import React from "react";
import { FBMapWrapper, FBPartsProps, FBSection } from "..";
import FBPartsItem from "../FBPartsItem/FBPartsItem";
import { withFBParts } from "./FBParts.wrap";

const FBParts: React.FunctionComponent<FBPartsProps> = ({
  equipment,
  materials,
  ...props
}) => (
  <>
    <FBSection label="form.builder.materials" />
    <FBMapWrapper collection={materials}>
      {(material: string) => <FBPartsItem value={material} />}
    </FBMapWrapper>
    <FBSection label="form.builder.equipment" />
    <FBMapWrapper collection={equipment}>
      {(eq: string) => <FBPartsItem value={eq} />}
    </FBMapWrapper>
  </>
);

export default withFBParts(FBParts);
