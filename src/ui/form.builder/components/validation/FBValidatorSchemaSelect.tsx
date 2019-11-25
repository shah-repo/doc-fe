import { observer } from "mobx-react";
import React from "react";
import FBValidatorStore from "../../stores/ui/FBValidatorStore";
import { FBSelectProps } from "../../types/select";
import FBSelect from "../inputs/FBSelect";

const FBValidatorSchemaSelect: React.FunctionComponent<FBSelectProps> = ({
  ...props
}) => (
  <FBSelect
    {...props}
    options={FBValidatorStore.schemaItemOptions}
  />
);

export default observer(FBValidatorSchemaSelect);
