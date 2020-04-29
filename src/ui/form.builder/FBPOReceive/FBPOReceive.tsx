import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { FBDialog, FBPOReceiveProps, FBPOReceiveTable, FBSchema, FBSchemaProps } from "..";
import FBSectionBox from "../components/layout/FBSectionBox";
import { FBAutocompleteAsync, FBAutocompleteAsyncOption } from "../FBAutocompleteAsync";
import { FBProvider } from "../FBProvider";
import { withFBPOReceive } from "./FBPOReceive.wrap";

const FBPOReceive: React.FunctionComponent<FBPOReceiveProps> = ({
  poReceiveState,
  dialogState,
  loading,
  schema,
  items,
  name,
  ...props
}) => (
  <FBProvider {...{ poReceiveState, dialogState }} >
    <FBDialog />
    <Box mb={4}>
      <FBAutocompleteAsync {...props} {...{ name }} optionId={FBAutocompleteAsyncOption.po} />
      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      {!loading && items && <FBPOReceiveTable {...{ items, name }} />}
      {!loading && <FBSectionBox label="PURCHASE ORDER" />}
      {!loading && schema && <FBSchema schema={schema as FBSchemaProps[]} />}
    </Box>
  </FBProvider>
);

export default withFBPOReceive(FBPOReceive);
