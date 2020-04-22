import { Box, Dialog, DialogContent, Typography } from "@material-ui/core";
import React, { useState } from "react";
import Text from "../../../components/Text";
import useDialog from "../../../hooks/useDialog";
import FBButton from "../../components/inputs/FBButton";
import ApprovalRoles from "../ApprovalRoles/ApprovalRoles";
import { FBApprovalMatrixTableProps } from "../FBApprovalMatrix.types";
import ApprovalMatrixSectionBox from "./ApprovalMatrixSectionBox";
import { withFBApprovalMatrixTable } from "./FBApprovalMatrixField.wrap";
import FBApprovalMatrixTable from "./FBApprovalMatrixTable";

const FBApprovalMatrixField: React.FunctionComponent<FBApprovalMatrixTableProps> = ({
  approvalRoles,
  approvalMatrix,
  handleEditDefaultTraining,
  handleEdit,
  handleAdd,
  addMode,
  cancelAddMode,
  handleAddRoleItems,
  handleSaveChanges,
  errorMessage,
  handleEditRoleDetails,
  addAnotherRole,
  handleSaveRole,
  handleCancelDialogRole,
  disabled,
  name,
}) => {
  const dialog = useDialog();
  const [editMode, toggleEditMode] = useState(false);


  const readInputValue = (event, header, index) => {
    handleAddRoleItems(index, event.target.value, header);
  };

  const readSelectValue = (event, index) => {
    handleAddRoleItems(index, event.target.value, "group");
  };

  const columns = React.useMemo(
    () => [
      {
        Header: " ",
        sticky: "left",
        columns: [
          {
            Header: "Prefix",
            width: 50,
            accessor: "acronym",
          },
          {
            Header: "Internal type",
            width: 100,
            accessor: "group",
          },
          {
            Header: "Document type",
            width: 193,
            accessor: "name",
          },
          {
            Header: "Training req.",
            width: 100,
            accessor: "defaultTraining",
            // eslint-disable-next-line react/display-name
            Cell: (rowData) => (
              <input
                type="checkbox"
                checked={rowData.row.original.defaultTraining ? true : false}
                onChange={handleEditDefaultTraining(rowData.row.index, !rowData.row.original.defaultTraining)}
                name={rowData.row.original.id}
              />),
          },
        ],
      },
      {
        Header: "Approvals numeric",
        columns: approvalRoles.map((group) => ({
          Header: group.name,
          accessor: `approvalsNumeric-${group.index}`,
          // eslint-disable-next-line react/display-name
          Cell: (rowData) => {
            const key = `approvalsNumeric-${group.index}`;
            return (
              <input
                type="checkbox"
                checked={rowData.row.original[key] ? true : false}
                name={key}
                onChange={handleEdit(rowData.row.index, !rowData.row.original[key], "stage1", group.index)}
              />);
          },
        })),
      },
      {
        Header: "Approvals numeric alpha",
        columns: approvalRoles.map((group) => ({
          Header: group.name,
          accessor: `approvalsNumericAlpha-${group.index}`,
          // eslint-disable-next-line react/display-name
          Cell: (rowData) => {
            const key = `approvalsNumericAlpha-${group.index}`;
            return (
              <input
                type="checkbox"
                checked={rowData.row.original[key] ? true : false}
                name={key}
                onChange={handleEdit(rowData.row.index, !rowData.row.original[key], "stage2", group.index)}
              />);
          },
        })),
      },
      {
        Header: "Approvals alpha",
        columns: approvalRoles.map((group) => ({
          Header: group.name,
          accessor: `approvalsAlpha-${group.index}`,
          // eslint-disable-next-line react/display-name
          Cell: (rowData) => {
            const key = `approvalsAlpha-${group.index}`;
            return (
              <input
                type="checkbox"
                checked={rowData.row.original[key] ? true : false}
                name={key}
                onChange={handleEdit(rowData.row.index, !rowData.row.original[key], "stage3", group.index)}
              />);
          },
        })),
      },
      {
        Header: "Approvals administrative",
        columns: approvalRoles.map((group) => ({
          Header: group.name,
          accessor: `approvalsAdmin-${group.index}`,
          // eslint-disable-next-line react/display-name
          Cell: (rowData) => {
            const key = `approvalsAdmin-${group.index}`;
            return (
              <input
                type="checkbox"
                checked={rowData.row.original[key] ? true : false}
                name={key}
                onChange={handleEdit(rowData.row.index, !rowData.row.original[key], "admStage", group.index)}
              />);
          },
        })),
      },
    ],
    [handleEdit, handleEditDefaultTraining, approvalRoles]
  );

  const docTypeData = approvalMatrix.map((e) => e.docType);
  const stage1Data = approvalMatrix.map((e) =>
    approvalRoles.map((role) => ({ [`approvalsNumeric-${role.index}`]: e.approvalRoles.stage1[role.index] })
    ));
  const stage2Data = approvalMatrix.map((e) =>
    approvalRoles.map((role) => ({ [`approvalsNumericAlpha-${role.index}`]: e.approvalRoles.stage2[role.index] })
    ));
  const stage3Data = approvalMatrix.map((e) =>
    approvalRoles.map((role) => ({ [`approvalsAlpha-${role.index}`]: e.approvalRoles.stage3[role.index] })
    ));
  const stageAdmData = approvalMatrix.map((e) =>
    approvalRoles.map((role) => ({ [`approvalsAdmin-${role.index}`]: e.approvalRoles.admStage[role.index] })
    ));
  const data = docTypeData.map((item, i) =>
    Object.assign({}, item, ...stage1Data[i], ...stage2Data[i], ...stage3Data[i], ...stageAdmData[i]));


  return (
    <Box mt={3}>
      <ApprovalRoles
        approvalRoles={ approvalRoles }
        addAnotherRole={addAnotherRole}
        handleEditRoleDetails={handleEditRoleDetails}
        handleSaveRole={handleSaveRole}
        handleCancelDialogRole={handleCancelDialogRole}
        errorMessage={errorMessage}
        disabled={disabled}
      />
      <ApprovalMatrixSectionBox
        label="Approval matrix"
        openDialog={() => dialog.open()}
        closeDialog={() => dialog.close()}
        toggleEditMode={toggleEditMode}
        editMode={editMode}
        addMode={addMode}
        disabled={disabled}
      />
      <FBApprovalMatrixTable
        addMode={addMode}
        data={data}
        columns={columns}
        editMode={editMode}
        readInputValue={readInputValue}
        readSelectValue={readSelectValue}
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
      {errorMessage && <Typography variant="subtitle2" color="error" style={{ marginTop: 10 }} ><Text message={errorMessage} /></Typography>}
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
            label="Approval matrix"
            openDialog={() => dialog.open()}
            closeDialog={() => dialog.close()}
            alreadyOpened={true}
            toggleEditMode={toggleEditMode}
            editMode={editMode}
            addMode={addMode}
            disabled={disabled}
          />
          <FBApprovalMatrixTable
            addMode={addMode}
            fullscreenMode={true}
            data={data}
            columns={columns}
            editMode={editMode}
            readInputValue={readInputValue}
            readSelectValue={readSelectValue}
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
          {errorMessage && <Typography variant="subtitle2" color="error" style={{ marginTop: 10 }} ><Text message={errorMessage} /></Typography>}
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
};

export default withFBApprovalMatrixTable(FBApprovalMatrixField);
