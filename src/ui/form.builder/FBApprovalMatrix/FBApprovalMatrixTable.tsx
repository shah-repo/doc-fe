import { Box, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import Text from "../../components/Text";
import Colors from "../../layout/theme/utils/colors";
import FBButton from "../components/inputs/FBButton";

interface Props {
  values?: any[];
  disabled?: boolean;
  editItem?: (index: number) => void;
  deleteItem?: (index: number) => void;
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: Colors.light_gray,
    color: theme.palette.common.black,
    textTransform: "uppercase",
  },
  body: {
    fontSize: 14,
  },
  root: {
    padding: "8px",
    maxWidth: "100%",
    borderLeft: "1px solid white",
  },
}))(TableCell);

const useStyles = makeStyles({
  root: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    minWidth: 700,
  },
  editable: {
    cursor: "pointer",
  },
});

const FBApprovalMatrixTable: React.FunctionComponent<Props> = ({
  values,
  editItem,
  deleteItem,
  disabled,
}) => {
  const classes = useStyles();
  // const handleEdit = (index) => () => !disabled && editItem(index);
  // const handleDelete = (index) => (e) => {
  //   e.stopPropagation();
  //   !disabled && deleteItem(index);
  // };
  // const [preCalc, setPreCalc] = useState<any[]>([]);
  // useEffect(() => {
  //   if (!values) {
  //     return;
  //   }

  //   const preCalcValues = values.map((value) => ({
  //     ...value,
  //     unitPrice: Number(value.unitPrice || 0).toFixed(2),
  //     amount: (Number(value.unitPrice || 0) * Number(value.order || 0)).toFixed(2),
  //   }));

  //   setPreCalc(preCalcValues);
  // }, [values]);

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
            false,
            false,
            true,
            false,
            false,
            false,
          ],
          stage2: [
            false,
            false,
            false,
            false,
            true,
            false,
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
    ],
  };

  const renderForEveryApproval = _.times(4, () => roles.approvalRoles.map((group) => <StyledTableCell align="center" key={group.index}>
    <Text message={group.name} />
  </StyledTableCell>));

  return (
    <Box className={classes.root}>
      <Table className={classes.table} aria-label="purchase order table">
        <TableHead>
          <TableRow>
            <StyledTableCell colSpan={4}>
            </StyledTableCell>
            <StyledTableCell align="center" colSpan={roles.approvalRoles.length}>
              <Text message="Approvals Alpha" />
            </StyledTableCell>
            <StyledTableCell align="center" colSpan={roles.approvalRoles.length}>
              <Text message="Approvals Numeric Alpha" />
            </StyledTableCell>
            <StyledTableCell align="center" colSpan={roles.approvalRoles.length}>
              <Text message="Approvals Numeric" />
            </StyledTableCell>
            <StyledTableCell align="center" colSpan={roles.approvalRoles.length}>
              <Text message="Approvals Administrative" />
            </StyledTableCell>
          </TableRow>
          <TableRow>
            <StyledTableCell>
              <Text message="form.builder.field.prefix" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.internal.type" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="form.builder.field.document.type" />
            </StyledTableCell>
            <StyledTableCell style={{ borderRight: "1px solid white" }}>
              <Text message="form.builder.field.training.required" />
            </StyledTableCell>
            {renderForEveryApproval}
          </TableRow>
        </TableHead>
        <TableBody>
          {roles.approvalMatrix.map((row, index) => (
            <TableRow
              key={index}
            >
              <StyledTableCell align="left">{row.docType.acronym}</StyledTableCell>
              <StyledTableCell>{row.docType.acronym}</StyledTableCell>
              <StyledTableCell>{row.docType.name}</StyledTableCell>
              <StyledTableCell>{row.docType.defaultTraining ? "Yes" : "No"}</StyledTableCell>
              {row.approvalRoles.stage1.map((a, index) => <StyledTableCell align="center" key={index}>{a ? "Y" : ""}</StyledTableCell>)}
              {row.approvalRoles.stage2.map((a, index) => <StyledTableCell align="center" key={index}>{a ? "Y" : ""}</StyledTableCell>)}
              {row.approvalRoles.stage3.map((a, index) => <StyledTableCell align="center" key={index}>{a ? "Y" : ""}</StyledTableCell>)}
              {row.approvalRoles.admStage.map((a, index) => <StyledTableCell align="center" key={index}>{a ? "Y" : ""}</StyledTableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <FBButton
        fullWidth={true}
        disabled={disabled}
        label="form.builder.add.item"
        variant="outlined"
        style={{ margin: "8px 0" }}
      />
    </Box>
  );
};

export default FBApprovalMatrixTable;
