import { get, isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { useSelector } from 'react-redux';
import { FB, FBFileField, FBFileUploadState, FBProvider } from '../..';
import { Attachment } from '../../../../state/ducks/attachments/types';
import { authSelectors } from '../../../../state/ducks/auth';
import { ChangeRequestStatus } from '../../../../state/ducks/changeRequest/types';
import FBAttachmentNamePresenter from '../../../change.request/FBMaterialDisposition/components/FBTasksListTable/components/FBAttachmentNamePresenter';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  employeeEvidenceUpdates?: any
  employeeId: string
  name: string
  previousAttachments: Attachment[]
  isDisabled?: boolean
}

const EMPLOYEE_RESPONSE_FIELD = 'EMPLOYEE_RESPONSE_FIELD';

enum EmployeeStatus {
  Done = 'DONE',
}

const Editor: React.FC<Props> = ({ dataItem, employeeEvidenceUpdates, employeeId, isDisabled, previousAttachments }) => {
  const classes = styles();
  const { fileUploadState } = FB.useStores();
  const { id: taskId } = dataItem;

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
      disabled={true}
      name={taskId}
    />);
};

export const AttachmentsCellTemplate: React.FC<CustomTemplateProps & { currentState: any }> = (props) => {
  const { dataItem, currentState } = props;
  const classes = styles();
  const assigneList = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const currentUserId = useSelector(authSelectors.currentEmployeeId);
  const isClosedAR = currentState === ChangeRequestStatus.Closed;
  const showEditor = (employeeId, status) => currentUserId === employeeId && !isClosedAR && status !== EmployeeStatus.Done;

  return (<>
    {assigneList?.map(({ employeeId, attachments, status, name }) => {
      const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);
      return <div className={classes.employeeResponseFields}>
        <FBProvider {...{ fileUploadState }}>
          {(showEditor(employeeId, status)) && (
            <Editor {...props} {...{ employeeId, name, previousAttachments: attachments } } />
          )}
          { (!attachments.length) ? EMPTY_VALUE_PLACEHOLDER : <FBAttachmentNamePresenter {...{ files: attachments, fileUploadState, isDisabled: !showEditor(employeeId, status) }} boxProps={{ className: classes.attachmentsContainer }} />}
        </FBProvider>
      </div>;
    })}
  </>);
};
