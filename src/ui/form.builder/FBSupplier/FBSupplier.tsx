import { Box } from "@material-ui/core";
import React from "react";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption, FBButton, FBDialog, FBInput, FBProvider, FBSupplierProps } from "..";
import { withFBSupplier } from "./FBSupplier.wrap";


const FBSupplier: React.FunctionComponent<FBSupplierProps> = ({
  handleAdd,
  label,
  disabled,
  loading,
  dialogState,
  supplierState,
}) => (
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
            omitFormValue
            name="supplier"
            optionId={FBAutocompleteAsyncOption.suppliers}
            {...{ label, disabled, loading }}
          />
        </Box>
        <Box>
          <FBButton
            variant="contained"
            label="form.builder.create.new.supplier"
            onClick={handleAdd}
            {...{ disabled }}
          />
        </Box>
      </Box>
    </FBInput>
  </FBProvider>
);

export default withFBSupplier(FBSupplier);
