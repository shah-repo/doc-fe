import React from "react";
import { FBSection } from "..";
import { FBEQMaintenanceProps } from "./FBEQMaintenance.types";
import { withFBEQMaintenance } from "./FBEQMaintenance.wrap";

const FBEQMaintenance: React.FunctionComponent<FBEQMaintenanceProps> = ({
  ...props
}) => (
  <FBSection
    label="form.builder.preventative.maintenance"
  />
);
export default withFBEQMaintenance(FBEQMaintenance);
