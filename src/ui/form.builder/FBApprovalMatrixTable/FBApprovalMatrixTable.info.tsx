import { Box, Table, TableBody, TableHead, TableRow } from "@material-ui/core";
import { keys, map, values } from "lodash";
import React from "react";
import * as generateUuid from "uuid/v4";
import { FBApprovalMatrixCheck, FBApprovalMatrixItem, FBApprovalMatrixTableInfoHead, FBApprovalMatrixTableProps, FBCheckbox, FBDocTypeGroup, FBMapWrapper, FBSelect, FBTableCell, FBTextField } from "..";

const FBApprovalMatrixTableInfo: React.FunctionComponent<FBApprovalMatrixTableProps> = ({
  approvalData: { approvalMatrix = [] } = {},
  classes,
  mode,
  name,
}) => (
  <Table className={classes?.tableInfo}>
    <TableHead>
      <TableRow>
        <FBMapWrapper<string[]> collection={values(FBApprovalMatrixTableInfoHead)}>
          {(head: string, index) => (
            <FBTableCell
              key={`fb-approval-matrix-column-${head}-${index}`}
              label={head}
              style={{ minWidth: (head === FBApprovalMatrixTableInfoHead.documentType) ? 115 : 55 }}
              align="center"
            />
          )}
        </FBMapWrapper>
      </TableRow>
    </TableHead>
    <TableBody>
      <FBMapWrapper<FBApprovalMatrixItem[]>
        collection={approvalMatrix}
      >
        {(am: FBApprovalMatrixItem, index) => (
          <TableRow key={`fb-approval-matrix-am-${am.id}-${index}`}>
            <FBTableCell
              label={am.docType.acronym}
              align="center"
            />
            <FBTableCell
              label={am.docType.group}
              align="center"
            />
            <FBTableCell
              label={am.docType.name}
              align="center"
            />
            {mode !== "edit" && (
              <FBTableCell
                label={`common.${am.docType.defaultTraining}`}
                align="center"
              />
            )}
            {mode === "edit" && (
              <FBTableCell align="center">
                <FBApprovalMatrixCheck
                  name={`${name}.approvalMatrix.${index}.docType.defaultTraining`}
                  checked={am.docType.defaultTraining}
                />
              </FBTableCell>
            )}
            {mode !== "edit" && (
              <FBTableCell
                label={`common.${am.docType.needsSignature}`}
                align="center"
              />
            )}
            {mode === "edit" && (
              <FBTableCell align="center">
                <FBApprovalMatrixCheck
                  name={`${name}.approvalMatrix.${index}.docType.needsSignature`}
                  checked={am.docType.needsSignature}
                />
              </FBTableCell>
            )}
            <FBTableCell
              label={am.docType.category}
              align="center"
            />
          </TableRow>
        )}
      </FBMapWrapper>
      {mode === "add" && (
        <TableRow>
          <FBTextField
            name={`${name}.approvalMatrix.${approvalMatrix.length}.id`}
            defaultValue={generateUuid()}
            hidden={true}
          />
          <FBMapWrapper<string[]> collection={keys(FBApprovalMatrixTableInfoHead)}>
            {(key: keyof typeof FBApprovalMatrixTableInfoHead, index) => (
              <>
                {key === "trainingReq" && (
                  <FBTableCell>
                    <Box display="flex" justifyContent="center" pl={3}>
                      <FBCheckbox
                        name={`${name}.approvalMatrix.${approvalMatrix.length}.docType.defaultTraining`}
                        dataCy={key}
                        gutter={false}
                        defaultChecked={false}
                      />
                    </Box>
                  </FBTableCell>
                )}
                {key === "needsSignature" && (
                  <FBTableCell>
                    <Box display="flex" justifyContent="center" pl={3}>
                      <FBCheckbox
                        name={`${name}.approvalMatrix.${approvalMatrix.length}.docType.needsSignature`}
                        dataCy={key}
                        gutter={false}
                        defaultChecked={false}
                      />
                    </Box>
                  </FBTableCell>
                )}
                {key === "internalType" && (
                  <FBTableCell>
                    <Box display="flex" px={1} alignItems="center">
                      <FBSelect
                        dataCy={key}
                        name={`${name}.approvalMatrix.${approvalMatrix.length}.docType.group`}
                        rules="required"
                        showErrorMsg={false}
                        // TODO: define options as static
                        options={map(keys(FBDocTypeGroup), (k) =>
                          ({ text: FBDocTypeGroup[k as keyof typeof FBDocTypeGroup], value: k })
                        )}
                        gutter={false}
                        style={{ height: "30px", width: "100%" }}
                      />
                    </Box>
                  </FBTableCell>
                )}
                {(key === "prefix") && (
                  <FBTableCell>
                    <Box display="flex" px={1}>
                      <FBTextField
                        name={`${name}.approvalMatrix.${approvalMatrix.length}.docType.acronym`}
                        dataCy={key}
                        gutter={false}
                        size="small"
                        inputProps={{ style: { padding: "8px" } }}
                        rules="required"
                        showErrorMsg={false}
                        transform="upper"
                      />
                    </Box>
                  </FBTableCell>
                )}
                {(key === "documentType") && (
                  <FBTableCell>
                    <Box display="flex" px={1}>
                      <FBTextField
                        name={`${name}.approvalMatrix.${approvalMatrix.length}.docType.name`}
                        dataCy={key}
                        gutter={false} size="small"
                        inputProps={{ style: { padding: "8px" } }}
                        rules="required"
                        showErrorMsg={false}
                      />
                    </Box>
                  </FBTableCell>
                )}
                {(key === "category") && (
                  <FBTableCell>
                    <Box display="flex" px={1}>
                      <FBTextField
                        name={`${name}.approvalMatrix.${approvalMatrix.length}.docType.category`}
                        dataCy={key}
                        gutter={false} size="small"
                        inputProps={{ style: { padding: "8px" } }}
                        showErrorMsg={false}
                      />
                    </Box>
                  </FBTableCell>
                )}
              </>
            )}
          </FBMapWrapper>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

export default FBApprovalMatrixTableInfo;
