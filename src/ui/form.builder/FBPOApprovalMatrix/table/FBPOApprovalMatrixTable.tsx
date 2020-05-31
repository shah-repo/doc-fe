import { Box, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from "@material-ui/core";
import classNames from "classnames";
import React from "react";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";
import { FBPOApprovalMatrixTableProps } from "../FBPOApprovalMatrix.types";
import FBPOApprovalMatrixDialog from "../form/FBPOApprovalMatrixDialog";
import { withFBPOApprovalMatrixTable } from "./FBPOApprovalMatrixTable.wrap";

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
  },
}))(TableCell);

const useStyles = makeStyles({
  root: {
    maxWidth: "100%",
  },
  editable: {
    cursor: "pointer",
  },
});

const FBPOApprovalMatrixTable: React.FunctionComponent<FBPOApprovalMatrixTableProps> = ({
  disabled,
  approvalLevels,
  employees,
  groups,
  handleEdit,
  isDocumentReleased,
  isDialogOpen,
  closeDialog,
  initialValues,
  onSubmit,
  name,
  signatureStages,
  groupOptions,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Table aria-label="purchase order approval matrix table">
        <TableHead>
          <TableRow>
            <StyledTableCell style={{ width: 95 }}>
              <Text message="Level Name" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="Limit" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="Signature 1" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="Signature 2" />
            </StyledTableCell>
            <StyledTableCell>
              <Text message="Signature 3" />
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {approvalLevels?.map((row: any, index) => (
            <TableRow
              key={`${row.name}-${index}`}
              onClick={handleEdit(index, row)}
              className={classNames({ [classes.editable]: !disabled })}
            >
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.limit}</StyledTableCell>
              {row.signatures.map((signature, index) =>
                (
                  <StyledTableCell key={`${signature?.name}-${index}`}>
                    {signature?.groups?.map((group) =>
                      <>
                        { groups?.get(group.id) && (
                          <Box width="max-content"
                            bgcolor="lightgray"
                            borderRadius="3px"
                            p={0.3} m={0.3}>
                            {groups?.get(group.id)?.name}
                          </Box>
                        )}
                      </>
                    )}
                    {signature?.employees?.map((employee) =>
                      employees.map((e) => {
                        if (e.id === employee.id) {
                          return (
                            <Box width="max-content"
                              bgcolor="lightgray"
                              borderRadius="3px"
                              p={0.3} m={0.3}>{e.user.name}</Box>
                          );
                        }
                        return null;
                      }
                      ))}</StyledTableCell>)
              )
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {
        !isDocumentReleased && isDialogOpen &&
        <FBPOApprovalMatrixDialog
          {...{
            isDialogOpen,
            closeDialog,
            initialValues,
            onSubmit,
            name,
            groupOptions,
            employees,
            signatureStages,
          }}
        />
      }
    </Box>
  );
};

export default withFBPOApprovalMatrixTable(FBPOApprovalMatrixTable);
