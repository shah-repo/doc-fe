import { Box, Dialog, DialogContent } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import useDialog from "../../hooks/useDialog";
import FBButton from "../components/inputs/FBButton";
import FBCheckbox from "../components/inputs/FBCheckbox";
import FBStore from "../stores/ui/FBStore";
import ApprovalMatrixSectionBox from "./ApprovalMatrixSectionBox";
import ApprovalRoles from "./ApprovalRoles/ApprovalRoles";
import ReactTable from "./ReactTable";


export interface PurchaseOrderItem {
  order: number;
  units: string;
  partNumber: string;
  date: Date;
  description: string;
  unitPrice: number;
  tax: boolean;
  isTraceabilityRequired: boolean;
  capitalEquipment: boolean;
}

export interface PurchaseOrder {
  items: PurchaseOrderItem[];
  shippingCost: number | undefined;
}

const FBapprovalMatrixField: React.FunctionComponent<any> = ({
  label,
  disabled,
  ...props
}) => {
  const storeValue = FBStore.getValues()[props.name] || { items: [], shippingCost: undefined };
  const dialog = useDialog();

  useEffect(() => {
    if (!storeValue) {
      FBStore.setValues({
        ...FBStore.getValues(),
        [props.name]: { items: [], shippingCost: undefined },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const editItem = (index: number) => {
  //   // workaround need to calculate total cost when editing item
  //   FBStore.setValues({
  //     ...FBStore.getValues(),
  //     ...storeValue.items[index],
  //   });
  //   dialog.open();
  // };

  // const deleteItem = (index: number) => {
  //   const filtered = (storeValue.items || [])
  //     .filter((order, i) => i !== index)
  //     .map((value, index) => ({ ...value, index: index + 1 }));

  //   FBStore.setValues({
  //     ...FBStore.getValues(),
  //     [props.name]: {
  //       ...storeValue,
  //       items: [...filtered],
  //     },
  //   });
  // };

  const roles = {
    approvalRoles: [
      {
        id: "991a4ceb-e0f3-43b8-8776-49165b63a46f",
        employees: [
          {
            createdAt: "2020-03-27T11:12:20.202Z",
            updatedAt: "2020-03-27T11:12:20.202Z",
            id: "9ca17461-e79c-457a-97ba-906a2e1ed885",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2020-03-27T11:12:20.202Z",
              updatedAt: "2020-03-27T11:12:51.989Z",
              id: "688f2410-4256-4f84-a8a7-91721555d3f4",
              email: "ivan.veselin+4@codecons.com",
              name: "Ivan the Fourth",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
        ],
        name: "Sr. QA",
        index: 0,
      },
      {
        id: "c686609b-b2d3-4d33-8a96-6beea5ba1d4f",
        employees: [
          {
            createdAt: "2020-03-27T10:34:03.201Z",
            updatedAt: "2020-03-27T10:34:03.201Z",
            id: "573bc603-501e-4cc5-ad4e-92aa4f2e1896",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2019-11-15T09:31:59.204Z",
              updatedAt: "2019-11-15T09:31:59.204Z",
              id: "04867f31-9ff1-483e-8f80-94d47530e0bc",
              email: "ivan.veselin+3@codecons.com",
              name: "Ivan the Third",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
        ],
        name: "Sr. Engineer",
        index: 1,
      },
      {
        id: "da51950b-2573-4577-be7c-ba3f42b5ac64",
        employees: [
          {
            createdAt: "2020-03-27T11:12:20.202Z",
            updatedAt: "2020-03-27T11:12:20.202Z",
            id: "9ca17461-e79c-457a-97ba-906a2e1ed885",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2020-03-27T11:12:20.202Z",
              updatedAt: "2020-03-27T11:12:51.989Z",
              id: "688f2410-4256-4f84-a8a7-91721555d3f4",
              email: "ivan.veselin+4@codecons.com",
              name: "Ivan the Fourth",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
          {
            createdAt: "2020-03-27T10:34:03.201Z",
            updatedAt: "2020-03-27T10:34:03.201Z",
            id: "691faa7c-9c48-4a5a-8ab3-d633015288a6",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2019-11-15T09:31:59.204Z",
              updatedAt: "2019-11-15T09:31:59.204Z",
              id: "e0140d81-20c6-4b37-8d3f-e4a4664aee59",
              email: "ivan.veselin+2@codecons.com",
              name: "Ivan the Second",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
          {
            createdAt: "2020-03-27T10:34:03.201Z",
            updatedAt: "2020-03-27T10:34:03.201Z",
            id: "ab82af5e-f9d5-42be-a761-f57893fd3887",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2019-11-15T09:31:59.204Z",
              updatedAt: "2019-11-15T09:31:59.204Z",
              id: "7299f9d6-d1d3-4afe-8749-8f5184ea4f7a",
              email: "ivan.veselin+1@codecons.com",
              name: "Ivan the First",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
          {
            createdAt: "2020-03-27T10:34:03.201Z",
            updatedAt: "2020-03-27T10:34:03.201Z",
            id: "573bc603-501e-4cc5-ad4e-92aa4f2e1896",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2019-11-15T09:31:59.204Z",
              updatedAt: "2019-11-15T09:31:59.204Z",
              id: "04867f31-9ff1-483e-8f80-94d47530e0bc",
              email: "ivan.veselin+3@codecons.com",
              name: "Ivan the Third",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
        ],
        name: "R&D",
        index: 2,
      },
      {
        id: "9b21d78f-39ae-4909-a1d3-8213d9f74c02",
        employees: [
          {
            createdAt: "2020-03-27T11:12:20.202Z",
            updatedAt: "2020-03-27T11:12:20.202Z",
            id: "9ca17461-e79c-457a-97ba-906a2e1ed885",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2020-03-27T11:12:20.202Z",
              updatedAt: "2020-03-27T11:12:51.989Z",
              id: "688f2410-4256-4f84-a8a7-91721555d3f4",
              email: "ivan.veselin+4@codecons.com",
              name: "Ivan the Fourth",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
          {
            createdAt: "2020-03-27T10:34:03.201Z",
            updatedAt: "2020-03-27T10:34:03.201Z",
            id: "691faa7c-9c48-4a5a-8ab3-d633015288a6",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2019-11-15T09:31:59.204Z",
              updatedAt: "2019-11-15T09:31:59.204Z",
              id: "e0140d81-20c6-4b37-8d3f-e4a4664aee59",
              email: "ivan.veselin+2@codecons.com",
              name: "Ivan the Second",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
        ],
        name: "QA",
        index: 3,
      },
      {
        id: "bd4872c5-b41e-4eb2-a487-0c47ee5d40f3",
        employees: [
          {
            createdAt: "2020-03-27T10:34:03.201Z",
            updatedAt: "2020-03-27T10:34:03.201Z",
            id: "ab82af5e-f9d5-42be-a761-f57893fd3887",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2019-11-15T09:31:59.204Z",
              updatedAt: "2019-11-15T09:31:59.204Z",
              id: "7299f9d6-d1d3-4afe-8749-8f5184ea4f7a",
              email: "ivan.veselin+1@codecons.com",
              name: "Ivan the First",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
          {
            createdAt: "2020-03-27T10:34:03.201Z",
            updatedAt: "2020-03-27T10:34:03.201Z",
            id: "573bc603-501e-4cc5-ad4e-92aa4f2e1896",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2019-11-15T09:31:59.204Z",
              updatedAt: "2019-11-15T09:31:59.204Z",
              id: "04867f31-9ff1-483e-8f80-94d47530e0bc",
              email: "ivan.veselin+3@codecons.com",
              name: "Ivan the Third",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
        ],
        name: "Engingeering",
        index: 4,
      },
      {
        id: "6f0d4c60-3a4e-4c7b-b380-79edb00259b2",
        employees: [
          {
            createdAt: "2020-03-27T10:34:03.201Z",
            updatedAt: "2020-03-27T10:34:03.201Z",
            id: "f85b3816-8c98-4698-a325-a17370382156",
            active: true,
            slackUserId: null,
            user: {
              createdAt: "2020-03-27T10:34:03.201Z",
              updatedAt: "2020-03-27T10:37:51.859Z",
              id: "3d52f2e6-69fd-4bf6-98cc-964ceb2957d9",
              email: "ivan.veselin+special@codecons.com",
              name: "Ivan the CEO",
              confirmed: true,
              permissions: null,
              avatar: null,
            },
          },
        ],
        name: "CEO",
        index: 5,
      },
    ],
    approvalMatrix: [
      {
        docType: {
          id: "78bf1255-8292-4cbe-b54f-3accef4d8a8d",
          acronym: "TWG",
          name: "Type With Approval Groups",
          defaultTraining: true,
          group: "OTHER",
        },
        approvalRoles: {
          stage1: [
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          stage2: [
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          stage3: [
            true,
            true,
            false,
            false,
            false,
            true,
          ],
          admStage: [
            false,
            false,
            false,
            true,
            false,
            false,
          ],
        },
      },
      {
        docType: {
          id: "4522a1ae-94b9-4b6d-b8f2-522f110d9fd4",
          acronym: "TWOG",
          name: "Type Without Approval Groups",
          defaultTraining: true,
          group: "OTHER",
        },
        approvalRoles: {
          stage1: [
            true,
            false,
            true,
            false,
            true,
            false,
          ],
          stage2: [
            false,
            false,
            false,
            true,
            false,
            false,
          ],
          stage3: [
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          admStage: [
            false,
            false,
            false,
            false,
            false,
            false,
          ],
        },
      },
      {
        docType: {
          id: "b5390ff7-4861-4db7-ab0c-aa5469a83d86",
          acronym: "SOP",
          name: "Standard Operating Procedure",
          defaultTraining: true,
          group: "OTHER",
        },
        approvalRoles: {
          stage1: [
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          stage2: [
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          stage3: [
            false,
            false,
            false,
            false,
            false,
            false,
          ],
          admStage: [
            false,
            false,
            false,
            false,
            false,
            false,
          ],
        },
      },
      {
        docType: {
          id: "1adddc7d-995d-4d15-8329-ad898b17576d",
          acronym: "ADM",
          name: "Administrative",
          defaultTraining: false,
          group: "OTHER",
        },
        approvalRoles: {
          stage1: [
            false,
            false,
            false,
            false,
            false,
            true,
          ],
          stage2: [
            false,
            false,
            false,
            true,
            false,
            false,
          ],
          stage3: [
            false,
            false,
            true,
            false,
            false,
            false,
          ],
          admStage: [
            true,
            false,
            false,
            false,
            false,
            false,
          ],
        },
      },
    ],
  };

  const [editMode, toggleEditMode] = useState(false);

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
            // eslint-disable-next-line react/display-name
            Cell: ({ value }) => (
              <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning>
                {value}
              </div>
            ),
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
              <FBCheckbox
                value={rowData.row.original.defaultTraining ? true : false}
                label=" "
                name={rowData.row.original.id}
                isFullWidth={false}
                gutter={false}
              />
            ),
          },
        ],
      },
      {
        Header: "Approvals numeric",
        columns: roles.approvalRoles.map((group) => ({
          Header: group.name,
          accessor: `approvalsNumeric-${group.index}`,
          maxWidth: 100,
          // eslint-disable-next-line react/display-name
          Cell: (rowData) => {
            const key = `approvalsNumeric-${group.index}`;
            return (
              <FBCheckbox
                value={rowData.row.original[key] ? true : false}
                label=" "
                name={key}
                isFullWidth={false}
                gutter={false}
              />);
          },
        })),
      },
      {
        Header: "Approvals numeric alpha",
        maxWidth: 100,
        columns: roles.approvalRoles.map((group) => ({
          Header: group.name,
          accessor: `approvalsNumericAlpha-${group.index}`,
          maxWidth: 100,
          // eslint-disable-next-line react/display-name
          Cell: (rowData) => {
            const key = `approvalsNumericAlpha-${group.index}`;
            return (
              <FBCheckbox
                value={rowData.row.original[key] ? true : false}
                label=" "
                name={key}
                isFullWidth={false}
                gutter={false}
              />);
          },
        })),
      },
      {
        Header: "Approvals alpha",
        maxWidth: 100,
        columns: roles.approvalRoles.map((group) => ({
          Header: group.name,
          accessor: `approvalsAlpha-${group.index}`,
          maxWidth: 100,
          // eslint-disable-next-line react/display-name
          Cell: (rowData) => {
            const key = `approvalsAlpha-${group.index}`;
            return (
              <FBCheckbox
                value={rowData.row.original[key] ? true : false}
                label=" "
                name={key}
                isFullWidth={false}
                gutter={false}
              />);
          },
        })),
      },
      {
        Header: "Approvals administrative",
        maxWidth: 100,
        columns: roles.approvalRoles.map((group) => ({
          Header: group.name,
          accessor: `approvalsAdmin-${group.index}`,
          maxWidth: 100,
          // eslint-disable-next-line react/display-name
          Cell: (rowData) => {
            const key = `approvalsAdmin-${group.index}`;
            if (editMode) {
              return (
                <FBCheckbox
                  value={rowData.row.original[key] ? true : false}
                  label=" "
                  name={key}
                  isFullWidth={false}
                  gutter={false}
                />);
            }
            return (
              <div key={key} className="td">
                {rowData.row.original[key] ? true : false}
              </div>
            );
          },
        })),
      },
    ],
    [roles.approvalRoles, editMode]
  );

  const docTypeData = roles.approvalMatrix.map((e) => e.docType);
  const stage1Data = roles.approvalMatrix.map((e) =>
    roles.approvalRoles.map((role) => ({ [`approvalsNumeric-${role.index}`]: e.approvalRoles.stage1[role.index] })
    ));
  const stage2Data = roles.approvalMatrix.map((e) =>
    roles.approvalRoles.map((role) => ({ [`approvalsNumericAlpha-${role.index}`]: e.approvalRoles.stage2[role.index] })
    ));
  const stage3Data = roles.approvalMatrix.map((e) =>
    roles.approvalRoles.map((role) => ({ [`approvalsAlpha-${role.index}`]: e.approvalRoles.stage3[role.index] })
    ));
  const stageAdmData = roles.approvalMatrix.map((e) =>
    roles.approvalRoles.map((role) => ({ [`approvalsAdmin-${role.index}`]: e.approvalRoles.admStage[role.index] })
    ));
  const data = docTypeData.map((item, i) => Object.assign({}, item, ...stage1Data[i], ...stage2Data[i], ...stage3Data[i], ...stageAdmData[i]));

  return (
    <Box mt={3}>
      <ApprovalRoles/>
      <ApprovalMatrixSectionBox
        label={label} isOpen={dialog.isOpen}
        openDialog={() => dialog.open()}
        closeDialog={() => dialog.close()}
        toggleEditMode={toggleEditMode}
        editMode={editMode}
      />
      <ReactTable data={data} columns={columns} editMode={editMode} />
      <FBButton
        fullWidth={true}
        disabled={disabled}
        label="form.builder.add.item"
        variant="outlined"
        style={{ margin: "8px 0" }}
      />
      <Dialog fullScreen={true} open={dialog.isOpen}>
        <DialogContent>
          <ApprovalMatrixSectionBox
            label={label} isOpen={dialog.isOpen}
            openDialog={() => dialog.open()}
            closeDialog={() => dialog.close()}
            alreadyOpened={true}
            toggleEditMode={toggleEditMode}
            editMode={editMode}
          />
          <ReactTable data={data} columns={columns} editMode={editMode} />
          <FBButton
            fullWidth={true}
            disabled={disabled}
            label="form.builder.add.item"
            variant="outlined"
            style={{ margin: "8px 0" }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FBapprovalMatrixField;
