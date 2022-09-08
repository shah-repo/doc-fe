import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBDialog, FBInput, FBProvider, FBSupplierProps } from "..";
import { FBButtonStyles } from "../styles/FBButton.styles";
import { withFBSupplier } from "./FBSupplier.wrap";


const FBSupplier: React.FunctionComponent<FBSupplierProps> = ({
  handleAdd,
  label,
  disabled,
  loading,
  dialogState,
  supplierState,
  isPreview,
  name,
}) => {
  const classes = FBButtonStyles();
  return (
    <FBProvider {...{ dialogState, supplierState }}>
      <FBDialog />
      <FBInput type="supplier">
        <Box display="flex" alignItems="flex-end" mt={2.5}>
          <Box flexGrow={1}>
            <FBAutocompleteAsync
              placeholder="common.select"
              gutter={false}
              shouldReloadOnInit
              withState
              autosave
              optionId={FBAutocompleteAsyncOption.suppliers}
              {...{ name, label, disabled, loading }}
            />
          </Box>
          {!isPreview && <Box>
            <FBButton
              variant="contained"
              label="form.builder.create.new.supplier"
              onClick={handleAdd}
              {...{ disabled }}
              className={classes.button}
              style={{
                marginBottom: "0px",
                height: "40px",
              }}
            />
          </Box>}
        </Box>
      </FBInput>
    </FBProvider>
  );
};


export default withFBSupplier(FBSupplier);
