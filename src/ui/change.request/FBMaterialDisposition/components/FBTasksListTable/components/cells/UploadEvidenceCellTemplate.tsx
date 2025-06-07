import { isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { useSelector } from 'react-redux';
import { Attachment } from '../../../../../../../state/ducks/attachments/types';
import { authSelectors } from '../../../../../../../state/ducks/auth';
import { EMPTY_VALUE_PLACEHOLDER } from '../../../../../../components/KendoDataGrid/constants';
import { FB, FBFileField, FBFileUploadState, FBProvider } from '../../../../../../form.builder';
import { EmployeeStatus } from '../../constants';
import { CustomTemplateProps, EmployeeResponse } from '../../types';
import FBAttachmentNamePresenter from '../FBAttachmentNamePresenter';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  employeeId: string
  name: string
  previousAttachments: Attachment[]
}

const Editor: React.FC<Props> = ({ dataItem, employeeEvidenceUpdates, employeeId, isDisabled, previousAttachments }) => {
  const classes = styles();
  const { fileUploadState } = FB.useStores();
  const { taskId } = dataItem;

  React.useEffect(() => {
    if (!isEmpty(previousAttachments)) {
      fileUploadState?.setAttachments(previousAttachments);
    }
  }, []);

  React.useEffect(() => {
    const disposer = reaction(
      () => fileUploadState?.attachments,
      (attachments) => {
        if (attachments?.length !== previousAttachments.length) {
            employeeEvidenceUpdates?.(dataItem, employeeId, attachments as Attachment[]);
        }
      },
    );
    return () => {
      disposer();
    };
  }, [dataItem, employeeEvidenceUpdates]);

  return (
    <FBFileField className={classes.uploadEvidenceField}
      labelClassName={classes.uploadEvidenceFieldLabel}
      iconClassName={classes.uploadEvidenceFieldIcon}
      disabled={isDisabled}
      name={taskId}
    />);
};

export const UploadEvidenceCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, isDisabled } = props;
  const classes = styles();
  const assignees = dataItem?.employeeResponse ?? [];
  const currentUserId = useSelector(authSelectors.currentEmployeeId);
  const shouldShowEditor = (employeeId: string, status: string) => currentUserId === employeeId && !isDisabled && status !== EmployeeStatus.Done;

  return (<>
    {assignees?.map(({ employeeId, attachments, status, name }: EmployeeResponse, index: number) => {
      const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);
      const canEdit = shouldShowEditor(employeeId, status);

      return (
        <div className={classes.employeeResponseFields} key={index}>
          <FBProvider {...{ fileUploadState }}>
            {canEdit && <Editor {...props} {...{ employeeId, name, previousAttachments: attachments }} />}
            {!attachments.length ? (
              !canEdit && EMPTY_VALUE_PLACEHOLDER
            ) : (
              <FBAttachmentNamePresenter
                {...{ files: attachments, fileUploadState, isDisabled: !canEdit }}
                boxProps={{ className: classes.attachmentsContainer }}
              />
            )}
          </FBProvider>
        </div>
      );
    })}
  </>);
};
