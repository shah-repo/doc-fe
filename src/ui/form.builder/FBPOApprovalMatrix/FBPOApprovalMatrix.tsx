import { Box, IconButton } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";
import { Provider } from "mobx-react";
import React from "react";
import { FBButton, FBDialog, FBInput, FBSection, FBTooltip } from "..";
import { FBPOApprovalMatrixFieldProps, FBPOApprovalMatrixTableProps } from "./FBPOApprovalMatrix.types";
import { withFBPOApprovalMatrix } from "./FBPOApprovalMatrix.wrap";
import FBPOApprovalMatrixTable from "./table/FBPOApprovalMatrixTable";

const FBPOApprovalMatrix: React.FunctionComponent<FBPOApprovalMatrixFieldProps> = ({
  handleAdd,
  handleRevert,
  poamState,
  dialogState,
  name,
  autosave,
  ...props
}) => (
  <Provider {...{ poamState, dialogState }}>
    <FBDialog />
    <FBInput {...{ name, autosave }} disabled={props.disabled} type="poApprovalMatrix">
      <Box mt={3}>
        <FBSection name={`fb-poam-section-${name}`} label={props.label}>
          <Box display="flex" flexDirection="row-reverse">
            <IconButton color="inherit" size="small" onClick={handleRevert} >
              <FBTooltip title='Revert to initial'>
                <ReplayIcon />
              </FBTooltip>
            </IconButton>
          </Box>
        </FBSection>
        <FBPOApprovalMatrixTable {...{ name }} {...props as FBPOApprovalMatrixTableProps} />
        <FBButton
          fullWidth={true}
          disabled={props.disabled}
          label="form.builder.add.item"
          onClick={handleAdd}
          variant="outlined"
          style={{ margin: "8px 0" }}
        />
      </Box>
    </FBInput>
  </Provider>
);

export default withFBPOApprovalMatrix(FBPOApprovalMatrix);
