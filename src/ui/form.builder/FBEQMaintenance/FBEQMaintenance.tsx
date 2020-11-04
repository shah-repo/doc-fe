import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBFieldName, FBInput } from "..";
import { FBSection } from "../FBSection";
import { FBEQMaintenanceProps } from "./FBEQMaintenance.types";
import { withFBEQMaintenance } from "./FBEQMaintenance.wrap";

const FBEQMaintenance: React.FunctionComponent<FBEQMaintenanceProps> = ({
  onAddClick,
  ...props
}) => (
  <>
    <FBSection
      label={"form.builder.preventative.maintenance"}
      name={`${FBFieldName.MaterialSection}`}
    />
    <FBButton
      variant="text"
      label="form.builder.new.pm"
      onClick={onAddClick}
    />
    <FBInput type="eqmaintenance">
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>
          <FBAutocompleteAsync
            label="form.builder.preventative.maintenance.form"
            optionId={FBAutocompleteAsyncOption.preventativeMaintenaceForms}
          />
        </Box>
      </Box>
    </FBInput>
  </>
);
export default withFBEQMaintenance(FBEQMaintenance);
