import { Grid } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBEBPartProps, FBInput, FBProvider } from "..";
import { withFBEBPart } from "./FBEBPart.wrap";

const FBEBPart: React.FunctionComponent<FBEBPartProps> = ({
  dialogState,
  name,
  onAddClick,
}) => (
  <FBProvider {...{ dialogState }}>
    <FBInput type="ebpart">
      <Grid>
        <FBAutocompleteAsync
          label="form.builder.part"
          placeholder="form.builder.select.existing.part"
          optionId={FBAutocompleteAsyncOption.materials}
          // optionId={FBAutocompleteAsyncOption.materialsAndEquipment}
          name={`fb-ebpart-${name}`}
        />
        <FBButton
          variant="contained"
          label="form.builder.create.new.part"
          onClick={onAddClick}
        />
      </Grid>
    </FBInput>
  </FBProvider>
);

export default withFBEBPart(FBEBPart);
