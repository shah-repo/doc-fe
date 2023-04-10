import { Box, IconButton, makeStyles } from "@material-ui/core";
import ReplayIcon from "@material-ui/icons/Replay";
import { Provider } from "mobx-react";
import React from "react";
import { FBButton, FBDialog, FBInput, FBSection, FBTooltip } from "..";
import { ReactComponent as PlusIcon } from "../../../assets/images/plus_icon_add_btn.svg";
import Colors from "../../layout/theme/utils/colors";
import { FBPOApprovalMatrixFieldProps, FBPOApprovalMatrixTableProps } from "./FBPOApprovalMatrix.types";
import { withFBPOApprovalMatrix } from "./FBPOApprovalMatrix.wrap";
import FBPOApprovalMatrixTable from "./table/FBPOApprovalMatrixTable";

const useStyles = makeStyles({
  button: {
    height: "40px",
    borderColor: Colors.dodger_blue,
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
      <FBInput {...{ name, autosave }} disabled={props.disabled} type="poApprovalMatrix">
        <Box>
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
            label="form.builder.add.line.item"
            onClick={handleAdd}
            showNewButton
            newVariant={true}
            className={classes?.button}
            startIcon={<PlusIcon />}
          />
        </Box>
      </FBInput>
    </Provider>
  );
};

export default withFBPOApprovalMatrix(FBPOApprovalMatrix);
