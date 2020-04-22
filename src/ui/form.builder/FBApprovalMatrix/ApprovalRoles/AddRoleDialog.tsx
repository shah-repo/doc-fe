import { Box, Button, createStyles, Dialog, DialogContent, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import useDialog from "../../../hooks/useDialog";
import FBButton from "../../components/inputs/FBButton";
import { ApprovalRole } from "../FBApprovalMatrix.types";
import ApprovalRolesPresenter from "./ApprovalRoles.presenter";

interface Props {
  activeEmployees: any;
  groupOptions: any;
  onSave: (dialog) => void;
  handleEditRoleDetails: (e, index, type) => void;
  isDisabled: boolean;
  addAnotherRole: () => void;
  approvalRoles: ApprovalRole[];
  handleCancelDialogRole: () => void;
  errorMessage: string;
  disabled: boolean;
}

const styles = makeStyles(() =>
  createStyles({
    dialogPaper: {
      overflowY: "unset",
    },
    dialogContent: {
      overflowY: "unset",
      padding: "24px",
    },
  },
  ));

export const AddRoleDialog: React.FunctionComponent<Props> = ({
  activeEmployees,
  groupOptions,
  onSave,
  handleEditRoleDetails,
  isDisabled,
  addAnotherRole,
  approvalRoles,
  handleCancelDialogRole,
  errorMessage,
  disabled,
}) => {
  const classes = styles();
  const dialog = useDialog();

  return (
    <React.Fragment>
      <FBButton
        fullWidth={true}
        label="form.builder.add.another.role"
        variant="outlined"
        style={{ margin: "0px 0px 32px 0px" }}
        onClick={() => {
          addAnotherRole();
          dialog.open();
        }}
        disabled={disabled}
      />
      <Dialog
        disableEscapeKeyDown={true}
        disableBackdropClick={true}
        fullWidth={true}
        maxWidth="md"
        open={dialog.isOpen}
        classes={{ paper: classes.dialogContent }}
        id="AddRoleDialog-dialog"
      >
        <DialogContent
          classes={{ root: classes.dialogContent }}
          id="AddRoleDialog-content"
        >
          {errorMessage && <Typography variant="subtitle2" color="error" style={{ marginTop: 10 }} >
            <Text message={errorMessage} /></Typography>}
          <ApprovalRolesPresenter
            isDisabled={isDisabled}
            handleEditRoleDetails={handleEditRoleDetails}
            name={approvalRoles[approvalRoles.length - 1] && approvalRoles[approvalRoles.length - 1].name}
            groups={approvalRoles[approvalRoles.length - 1] && approvalRoles[approvalRoles.length - 1].groups}
            employees={approvalRoles[approvalRoles.length - 1] && approvalRoles[approvalRoles.length - 1].employees}
            employeeOptions={activeEmployees}
            groupOptions={groupOptions}
            isWithoutBorder={true}
            index={approvalRoles.length - 1}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => onSave(dialog)}
              id="AddRoleDialog-save"
            >
              <Text translation="common.save"/>
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                handleCancelDialogRole();
                dialog.close();
              }}
              id="AddRoleDialog-cancel"
            >
              <Text translation="common.cancel"/>
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default AddRoleDialog;
