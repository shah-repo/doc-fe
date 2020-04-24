import React, { useState } from "react";
import { useIntl } from "react-intl";
import useDialog from "../../../hooks/useDialog";
import { FBApprovalMatrixTableProps } from "../FBApprovalMatrix.types";
import FBApprovalMatrixFieldUI from "./FBApprovalMatrixField.ui";
import { withFBApprovalMatrixTable } from "./FBApprovalMatrixField.wrap";

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
}) => {
  const dialog = useDialog();
  const [editMode, toggleEditMode] = useState(false);


  const readInputValue = (event, header, index) => {
    handleAddRoleItems(index, event.target.value, header);
  };

  const readSelectValue = (event, index) => {
    handleAddRoleItems(index, event.target.value, "group");
  };

  const intl = useIntl();

  const columns = React.useMemo(
    () => [
      {
        Header: " ",
        sticky: "left",
        columns: [
          {
            Header: intl.formatMessage({
              id: "form.builder.field.prefix",
            }),
            width: 50,
            accessor: "acronym",
          },
          {
            Header: intl.formatMessage({
              id: "form.builder.am.internal.type",
            }),
            width: 100,
            accessor: "group",
          },
          {
            Header: intl.formatMessage({
              id: "form.builder.field.document.type",
            }),
            width: 193,
            accessor: "name",
          },
          {
            Header: intl.formatMessage({
              id: "form.builder.field.training.req",
            }),
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
        Header: intl.formatMessage({
          id: "form.builder.approvals.numeric",
        }),
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
        Header: intl.formatMessage({
          id: "form.builder.approvals.numeric.alpha",
        }),
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
        Header: intl.formatMessage({
          id: "form.builder.approvals.alpha",
        }),
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
        Header: intl.formatMessage({
          id: "form.builder.approvals.admin",
        }),
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <FBApprovalMatrixFieldUI
      approvalRoles={approvalRoles}
      addAnotherRole={addAnotherRole}
      handleEditRoleDetails={handleEditRoleDetails}
      handleSaveRole={handleSaveRole}
      handleCancelDialogRole={handleCancelDialogRole}
      errorMessage={errorMessage}
      disabled={disabled}
      dialog={dialog}
      toggleEditMode={toggleEditMode}
      editMode={editMode}
      addMode={addMode}
      data={data}
      columns={columns}
      readInputValue={readInputValue}
      readSelectValue={readSelectValue}
      handleAdd={handleAdd}
      handleSaveChanges={handleSaveChanges}
      cancelAddMode={cancelAddMode}
    />
  );
};

export default withFBApprovalMatrixTable(FBApprovalMatrixField);
