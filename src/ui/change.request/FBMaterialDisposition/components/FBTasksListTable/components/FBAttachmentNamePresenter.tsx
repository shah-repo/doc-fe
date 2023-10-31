import { Box } from '@material-ui/core';
import { AttachFile } from '@material-ui/icons';
import React from 'react';
import { ReactComponent as CloseIcon } from '../../../../../../assets/images/trash.svg';
import { FBAttachment, FBFilesPresenterProps, FBMapWrapper } from '../../../../../form.builder';
import { withFBFilesPresenter } from '../../../../../form.builder/FBFilesPresenter/FBFilesPresenter.wrap';
import OverflowingContent from '../../commonCells/OveflowContent';
import { EmployeeStatus } from '../constants';
import { TasksListItem } from '../interface';

interface Props extends FBFilesPresenterProps {
  employeeId: string
  status: string
  dataItem: TasksListItem
  disabled?: boolean
  employeeEvidenceUpdates?: (dataItem: TasksListItem, employeeId: string, attachmentId: string) => void
}

const FBAttachmentNamePresenter: React.FunctionComponent<Props> = ({
  attachments = [],
  boxProps,
  employeeId,
  dataItem,
  status,
  disabled,
  employeeEvidenceUpdates,
}) => {
  const removeAttachment = () => {
    employeeEvidenceUpdates?.(dataItem, employeeId, '');
  };
  return (
    <Box { ...boxProps } display="flex" flexDirection="row" alignItems="center" flexWrap="wrap">
      <FBMapWrapper<FBAttachment[]> collection={attachments}>
        {(file: FBAttachment) => {
          const { name, type } = file;
          return (<>
            <AttachFile />
            <Box width={253} marginLeft={0.75} marginRight={0.75}>
              <OverflowingContent>
                <span>{`${name}.${type}`}</span>
              </OverflowingContent>
            </Box>
            {(status !== EmployeeStatus.Done && !disabled) && <CloseIcon cursor="pointer" onClick={removeAttachment} />}
          </>);
        }}
      </FBMapWrapper>
    </Box>
  );
};
export default withFBFilesPresenter(FBAttachmentNamePresenter);
