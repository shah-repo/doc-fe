import { Box, IconButton, makeStyles } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";
import { Provider } from "mobx-react";
import React from "react";
import { FBButton, FBDialog, FBInput, FBSection, FBTooltip } from "..";
import { ReactComponent as PlusIcon } from "../../../assets/images/plus_icon_add_btn.svg";
import { Colors } from "../../layout/theme-next";
import { FBPOApprovalMatrixFieldProps, FBPOApprovalMatrixTableProps } from "./FBPOApprovalMatrix.types";
import { withFBPOApprovalMatrix } from "./FBPOApprovalMatrix.wrap";
import FBPOApprovalMatrixTable from "./table/FBPOApprovalMatrixTable";

const useStyles = makeStyles({
  button: {
    height: 40,
    borderColor: Colors.primaryLight,
    borderStyle: "dashed",
    borderRadius: 0,
  },
});

const FBPOApprovalMatrix: React.FunctionComponent<FBPOApprovalMatrixFieldProps> = ({
  handleAdd,
  handleRevert,
  poamState,
  dialogState,
  name,
  autosave,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Provider {...{ poamState, dialogState }}>
      <FBDialog />
      <Box>
        <FBInput {...{ name, autosave }} disabled={props.disabled} type="poApprovalMatrix">
          <FBSection name={`fb-poam-section-${name}`} label={props.label}>
            <Box display="flex" flexDirection="row-reverse">
              <IconButton color="inherit" size="small" onClick={handleRevert} >
                <FBTooltip title="form.builder.poam.button.revert">
                  <ReplayIcon />
                </FBTooltip>
              </IconButton>
            </Box>
          </FBSection>
        </FBInput>
        <FBPOApprovalMatrixTable {...{ name }} {...props as FBPOApprovalMatrixTableProps} />
        {!props.disabled && <FBButton
          fullWidth={true}
          disabled={props.disabled}
          label="form.builder.add.line.item"
          onClick={handleAdd}
          showNewButton
          newVariant={true}
          className={classes?.button}
          startIcon={<PlusIcon />}
        />}
      </Box>
    </Provider>
  );
};

export default withFBPOApprovalMatrix(FBPOApprovalMatrix);
