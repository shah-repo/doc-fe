import { Box, Button, createStyles, Dialog, DialogContent, makeStyles } from "@material-ui/core";
import React from "react";
import Text from "../../../components/Text";
import useDialog from "../../../hooks/useDialog";
import FBButton from "../../components/inputs/FBButton";
import ApprovalRolesPresenter from "./ApprovalRoles.presenter";

interface Props {
  activeEmployees: any;
  groupOptions: any;
  onClick: () => void;
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
  onClick,
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
        onClick={dialog.open}
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
          <ApprovalRolesPresenter
            name={""}
            groups={[]}
            employees={[]}
            employeeOptions={activeEmployees}
            groupOptions={groupOptions}
            isWithoutBorder={true}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={onClick}
              id="AddRoleDialog-save"
            >
              <Text translation="common.save"/>
            </Button>
            <Button
              variant="outlined"
              onClick={dialog.close}
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
