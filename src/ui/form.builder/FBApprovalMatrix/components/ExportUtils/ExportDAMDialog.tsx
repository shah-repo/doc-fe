import { isEmpty } from 'lodash';
import { useObserver } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { exportDAM } from '.';
import { FB } from '../../..';
import { companySelectors } from '../../../../../state/ducks/company';
import { userManagementSelectors } from '../../../../../state/ducks/userManagement';
import { DialogHandler } from '../../../../hooks/useDialog';
import useTableCriteria from '../../../FBApprovalMatrixRoles/utils';
import { APPROVAL_MATRIX_TABLE_NAME } from '../../constants';
import { State } from '@progress/kendo-data-query';
import Dialog from '../../../../components/dialogs';
import { FormField, TextField } from '../../../../components/forms/fields-next';

interface Props {
  dialog: DialogHandler
  matrixTabDataState?: State
}

const ExportDAMDialog: React.FunctionComponent<Props> = ({
  dialog,
  matrixTabDataState,
}) => {
  const { approvalMatrixFieldState, workspaceState } = FB.useStores();
  const { dataState } = useTableCriteria(APPROVAL_MATRIX_TABLE_NAME);
  const existingRoles = useObserver(() => approvalMatrixFieldState?.getCurrentData('roles') ?? []);
  const numOfRevStages = useSelector(companySelectors.getCompanyMaxRevisionStage);
  const groupOptions = useSelector(userManagementSelectors.getOfficialGroups).map((group) => ({
    id: group.value,
    name: group.label,
  }));
  const [fileName, setFileName] = useState('');

  const handleFileName = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(ev.target.value);
  };

  const dowloadFile = () => {
    const datafilter = matrixTabDataState?.filter?.filters ?? dataState?.filter?.filters;
    const damName = `${workspaceState?.document?.document.docId} - ${workspaceState?.document?.name} - Rev ${workspaceState?.document?.displayRevision}`;
    exportDAM(approvalMatrixFieldState, groupOptions, existingRoles, numOfRevStages, fileName, damName, datafilter);
    dialog.close();
  };

  const closeDialog = () => {
    setFileName('');
    dialog.close();
  };

  return (
    <Dialog
      open={dialog.isOpen}
      fullWidth
      maxWidth="xs"
      onClose={closeDialog}
      onCancel={closeDialog}
      onConfirm={dowloadFile}
      cancelLabel="common.cancel"
      confirmLabel="common.download"
      confirmProps={{ disabled: isEmpty(fileName) }}
    >
      <FormField label="document.revision.enter.file.name">
        <TextField value={fileName} onChange={handleFileName} />
      </FormField>
    </Dialog>
  );
};

export default ExportDAMDialog;
