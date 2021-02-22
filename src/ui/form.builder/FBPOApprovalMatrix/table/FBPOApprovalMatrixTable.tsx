import { Box, makeStyles, Table, TableBody, TableCell, TableHead, TableRow, withStyles } from "@material-ui/core";
import classNames from "classnames";
import { find } from "lodash";
import React from "react";
import { FBMapWrapper, FBPOApprovalMatrixState } from "../..";
import Text from "../../../components/Text";
import Colors from "../../../layout/theme/utils/colors";
import { FBPOApprovalMatrixTableProps, POApprovalMatrixLevel } from "../FBPOApprovalMatrix.types";
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
          {approvalLevels?.map((row: POApprovalMatrixLevel, index) => (
            <TableRow
              key={`${row.name}-${index}`}
              {...!disabled && { onClick: handleEdit(index, row) }}
              className={classNames({ [classes.editable]: !disabled })}
            >
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.limit}</StyledTableCell>
              <FBMapWrapper<number[]> collection={FBPOApprovalMatrixState.stages}>
                {(signatureStage: number, index) => (
                  <StyledTableCell key={`fb-poam-signature-${row.id}-${index}`}>
                    {find(row.signatures, { signatureStage })?.groups?.map((group) =>
                      <>
                        { groups?.get(group.id) && (
                          <Box
                            key={`fb-poam-signature-group-${group.id}-${index}`}
                            width="max-content"
                            bgcolor="lightgray"
                            borderRadius="3px"
                            p={0.3} m={0.3}>
                            {groups?.get(group.id)?.name}
                          </Box>
                        )}
                      </>
                    )}
                    {find(row.signatures, { signatureStage })?.employees?.map((employee) =>
                      <>
                        {employees?.get(employee.id) && (
                          <Box
                            key={`fb-poam-signature-employee-${employee.id}-${index}`}
                            width="max-content"
                            bgcolor="lightgray"
                            borderRadius="3px"
                            p={0.3} m={0.3}>
                            {employees?.get(employee.id)?.user?.name}
                          </Box>
                        )}
                      </>
                    )}
                  </StyledTableCell>
                )}
              </FBMapWrapper>

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
