import { Box } from '@material-ui/core';
import React from 'react';
import { FBInput } from '../..';
import { FBPOApprovalMatrixTableProps } from '../FBPOApprovalMatrix.types';
import FBPOApprovalMatrixDialog from '../form/FBPOApprovalMatrixDialog';
import FBPOAMKendoTable from '../grid';
import { withFBPOApprovalMatrixTable } from './FBPOApprovalMatrixTable.wrap';

const FBPOApprovalMatrixTable: React.FunctionComponent<FBPOApprovalMatrixTableProps> = ({
  disabled,
  approvalLevels = [],
  employees,
  groups,
  handleEdit,
  isDocumentReleased,
  disableFilter = false,
  isDialogOpen,
  closeDialog,
  initialValues,
  onSubmit,
  name,
  signatureStages,
  groupOptions,
}) => (
  <Box>
    <FBPOAMKendoTable
      {...{
        approvalLevels,
        signatureStages,
        employees,
        groups,
        handleEdit,
        disableFilter,
        isDocumentReleased,
        disabled,
      }}
    />
    {!isDocumentReleased && isDialogOpen && (
      <FBInput>
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
      </FBInput>
    )}
  </Box>
);

export default withFBPOApprovalMatrixTable(FBPOApprovalMatrixTable);
