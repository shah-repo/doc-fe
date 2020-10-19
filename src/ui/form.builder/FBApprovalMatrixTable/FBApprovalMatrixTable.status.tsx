import { Box, Table, TableBody, TableHead, TableRow } from "@material-ui/core";
import { get, keys, values } from "lodash";
import React from "react";
import { FBApprovalMatrixCheck, FBApprovalMatrixItem, FBApprovalMatrixTableProps, FBApprovalMatrixTableRoleHead, FBApprovalRole, FBCheckbox, FBMapWrapper, FBTableCell } from "..";

const FBApprovalMatrixTableStatus: React.FunctionComponent<FBApprovalMatrixTableProps> = ({
  cellHeight,
  approvalData: { approvalRoles = [], approvalMatrix = [] } = {},
  mode,
  classes,
  name,
}) => (
  <Table className={classes?.tableStatus}>
    <TableHead >
      <TableRow style={{ height: "30px" }}>
        <FBMapWrapper<string[]> collection={values(FBApprovalMatrixTableRoleHead)}>
          {(head: string, index) => (
            <FBTableCell
              key={`fb-approval-matrix-column-${head}-${index}`}
              label={head}
              colSpan={approvalRoles.length}
              align="center"
              style={{ borderLeft: "1px solid #f0f0f0" }}
            />
          )}
        </FBMapWrapper>
      </TableRow>
      <TableRow style={{ height: "30px" }}>
        <FBMapWrapper<string[]> collection={values(FBApprovalMatrixTableRoleHead)}>
          {(head: string, index) => (
            <FBMapWrapper<FBApprovalRole[]>
              key={`fb-approval-matrix-column-${head}-${index}`}
              collection={approvalRoles}
            >
              {(role: FBApprovalRole, index) => (
                <FBTableCell
                  key={`fb-approval-matrix-column-${head}-${role.id}-${index}`}
                  label={role.name}
                  align="center"
                  style={{
                    ...index === 0 && { borderLeft: "1px solid #f0f0f0" },
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
        {(am: FBApprovalMatrixItem, i) => (
          <TableRow
            key={`fb-approval-matrix-stage-${am.id}-${i}`}
            ref={(el: HTMLDivElement) => {
              if (!el) return;
              el.style.height = `${cellHeight?.(el.getBoundingClientRect().height, i)}px`;
            }}
          >
            <FBMapWrapper<string[]> collection={keys(FBApprovalMatrixTableRoleHead)}>
              {(key: string, index) => (
                <FBMapWrapper<boolean[]>
                  key={`fb-approval-matrix-stage-${key}-${index}`}
                  collection={get(am.approvalRoles, key)}
                >
                  {(value: boolean, index) => (
                    <React.Fragment key={`fb-approval-matrix-stage-${am.id}-${index}`}>
                      {mode !== "edit" && (
                        <FBTableCell
                          label={`status.${value}`}
                          align="center"
                        />
                      )}
                      {mode === "edit" && (
                        <FBTableCell align="center">
                          <FBApprovalMatrixCheck
                            name={`${name}.approvalMatrix.${i}.approvalRoles.${key}.${index}`}
                            dataCy={`${name}.approvalMatrix.${i}.approvalRoles.${key}.${index}`}
                            checked={value}
                          />
                        </FBTableCell>
                      )}
                    </React.Fragment>
                  )}
                </FBMapWrapper>
              )}
            </FBMapWrapper>
          </TableRow>
        )}
      </FBMapWrapper>
      {mode === "add" && (
        <TableRow>
          <FBMapWrapper<string[]> collection={keys(FBApprovalMatrixTableRoleHead)}>
            {(key: string, index) => (
              <FBMapWrapper<FBApprovalRole[]>
                key={`fb-approval-matrix-add-${key}-${index}`}
                collection={approvalRoles}
              >
                {(value: FBApprovalRole, index) => (
                  <FBTableCell key={`fb-approval-matrix-add-${value}-${index}`}>
                    <Box display="flex" justifyContent="center" pl={3}>
                      <FBCheckbox
                        name={`${name}.approvalMatrix.${approvalMatrix.length}.approvalRoles.${key}.${index}`}
                        dataCy={`approvalMatrix.approvalRoles.${key}.${index}`}
                        gutter={false}
                        defaultChecked={false}
                        forceDefault={true}
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
