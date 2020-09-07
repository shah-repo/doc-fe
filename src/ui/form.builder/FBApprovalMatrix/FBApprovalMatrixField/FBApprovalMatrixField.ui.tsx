import { Box, Dialog, DialogContent, Typography } from "@material-ui/core";
import React from "react";
import { FBButton } from "../..";
import Text from "../../../components/Text";
import ApprovalRoles from "../ApprovalRoles/ApprovalRoles";
import { FBApprovalMatrixFieldUIProps } from "../FBApprovalMatrix.types";
import ApprovalMatrixSectionBox from "./ApprovalMatrixSectionBox";
import FBApprovalMatrixTable from "./FBApprovalMatrixTable";

const FBApprovalMatrixFieldUI: React.FunctionComponent<FBApprovalMatrixFieldUIProps> = ({
  approvalRoles,
  addAnotherRole,
  handleEditRoleDetails,
  handleSaveRole,
  handleCancelDialogRole,
  errorMessage,
  disabled,
  dialog,
  toggleEditMode,
  editMode,
  addMode,
  data,
  columns,
  readInputValue,
  readSelectValue,
  handleAdd,
  handleSaveChanges,
  cancelAddMode,
}) => (
  <Box mt={3}>
    <ApprovalRoles
      {...{
        approvalRoles,
        addAnotherRole,
        handleEditRoleDetails,
        handleSaveRole,
        handleCancelDialogRole,
        errorMessage,
        disabled,
      }}
    />
    <ApprovalMatrixSectionBox
      openDialog={() => dialog.open()}
      closeDialog={() => dialog.close()}
      {...{ toggleEditMode, editMode, addMode, disabled }}
    />
    <FBApprovalMatrixTable
      {...{
        addMode,
        data,
        columns,
        editMode,
        readInputValue,
        readSelectValue,
      }}
    />
    {!addMode &&
      <FBButton
        fullWidth={true}
        onClick={handleAdd}
        label="form.builder.add.item"
        variant="outlined"
        style={{ margin: "8px 0" }}
        disabled={editMode || disabled}
      />}
    {
      errorMessage &&
        <Typography variant="subtitle2" color="error" style={{ marginTop: 10 }} >
          <Text message={errorMessage} />
        </Typography>
    }
    {addMode &&
      <Box display="flex" flexDirection="row-reverse">
        <FBButton
          onClick={handleSaveChanges}
          label="Save changes"
          variant="contained"
          color="primary"
          style={{ margin: "8px" }}
        />
        <FBButton
          onClick={cancelAddMode}
          label="Cancel"
          variant="outlined"
          color="primary"
          style={{ margin: "8px" }}
        />
      </Box>}
    <Dialog fullScreen={true} open={dialog.isOpen}>
      <DialogContent>
        <ApprovalMatrixSectionBox
          openDialog={() => dialog.open()}
          closeDialog={() => dialog.close()}
          alreadyOpened={true}
          {...{ toggleEditMode, editMode, addMode, disabled }}
        />
        <FBApprovalMatrixTable
          addMode={addMode}
          fullscreenMode={true}
          {...{ addMode, data, columns, editMode, readInputValue, readSelectValue }}
        />
        {!addMode &&
            <FBButton
              fullWidth={true}
              onClick={handleAdd}
              label="form.builder.add.item"
              variant="outlined"
              style={{ margin: "8px 0" }}
              disabled={editMode || disabled}
            />}
        {errorMessage && <Typography variant="subtitle2" color="error" style={{ marginTop: 10 }}>
          <Text message={errorMessage} /></Typography>
        }
        {addMode &&
          <Box display="flex" flexDirection="row-reverse">
            <FBButton
              onClick={handleSaveChanges}
              label="Save"
              variant="contained"
              color="primary"
              style={{ margin: "8px" }}
            />
            <FBButton
              onClick={cancelAddMode}
              label="Cancel"
              variant="outlined"
              color="primary"
              style={{ margin: "8px" }}
            />
          </Box>}
      </DialogContent>
    </Dialog>
  </Box>
);

export default FBApprovalMatrixFieldUI;
