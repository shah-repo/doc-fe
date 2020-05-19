import { Box, Table, TableBody, TableHead, TableRow } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { FBApprovalMatrixItem, FBApprovalMatrixTableProps, FBApprovalMatrixTableRoleHead, FBApprovalRole, FBCheckbox, FBMapWrapper, FBTableCell } from "..";

const FBApprovalMatrixTableStatus: React.FunctionComponent<FBApprovalMatrixTableProps> = ({
  approvalRoles = [],
  approvalMatrix = [],
  mode,
  classes,
  name,
}) =>  (
  <Table className={classes?.tableStatus}>
    <TableHead >
      <TableRow style={{ height: "30px", position: "sticky", top: 0  }}>
        <FBMapWrapper<string[]> collection={_.values(FBApprovalMatrixTableRoleHead)}>
          {(head: string, index) => (
            <FBTableCell
              key={`fb-approval-matrix-column-${head}-${index}`}
              label={head}
              colSpan={approvalRoles.length}
              align="center"
              style={{ borderLeft: "1px solid #ccc" }}
            />
          )}
        </FBMapWrapper>
      </TableRow>
      <TableRow className="FBStatus-root" style={{ height: "30px" }}>
        <FBMapWrapper<string[]> collection={_.values(FBApprovalMatrixTableRoleHead)}>
          {(head: string) => (
            <FBMapWrapper<FBApprovalRole[]> collection={approvalRoles}>
              {(role: FBApprovalRole, index) => (
                <FBTableCell
                  key={`fb-approval-matrix-column-${head}-${role.id}-${index}`}
                  label={role.name}
                  align="center"
                  style={{
                    ...index === 0 && { borderLeft: "1px solid #ccc" },
                  }}
                />
              )}
            </FBMapWrapper>
          )}
        </FBMapWrapper>
      </TableRow>
    </TableHead>
    <TableBody>
      <FBMapWrapper<FBApprovalMatrixItem[]> collection={approvalMatrix}>
        {(am: FBApprovalMatrixItem, index) => (
          <TableRow key={`fb-approval-matrix-stage-${am.id}-${index}`}>
            <FBMapWrapper<string[]> collection={_.keys(FBApprovalMatrixTableRoleHead)}>
              {(key: string) => (
                <FBMapWrapper<boolean[]> collection={_.get(am.approvalRoles, key)}>
                  {(value: boolean, index) => (
                    <FBTableCell
                      key={`fb-approval-matrix-stage-value-${am.id}-${index}`}
                      label={value ? "Y" : ""}
                      align="center"
                    />
                  )}
                </FBMapWrapper>
              )}
            </FBMapWrapper>
          </TableRow>
        )}
      </FBMapWrapper>
      {mode === "add" && (
        <TableRow>
          <FBMapWrapper<string[]> collection={_.keys(FBApprovalMatrixTableRoleHead)}>
            {(key: string) => (
              <FBMapWrapper<FBApprovalRole[]> collection={approvalRoles}>
                {(_value: FBApprovalRole, index) => (
                  <FBTableCell>
                    <Box display="flex" justifyContent="center" pl={3}>
                      <FBCheckbox
                        name={`${name}.approvalMatrix.${approvalMatrix.length}.approvalRoles.${key}.${index}`}
                        gutter={false}
                        defaultChecked={false}
                      />
                    </Box>
                  </FBTableCell>
                )}
              </FBMapWrapper>
            )}
          </FBMapWrapper>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

export default FBApprovalMatrixTableStatus;
