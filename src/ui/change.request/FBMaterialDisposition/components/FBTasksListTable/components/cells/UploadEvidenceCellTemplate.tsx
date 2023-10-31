import { get, isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { useSelector } from 'react-redux';
import { authSelectors } from '../../../../../../../state/ducks/auth';
import { ChangeRequestStatus } from '../../../../../../../state/ducks/changeRequest/types';
import { FB, FBFileField, FBFileUploadState, FBProvider } from '../../../../../../form.builder';
import { EmployeeStatus, EMPLOYEE_RESPONSE_FIELD, EMPTY_VALUE_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../interface';
import FBAttachmentNamePresenter from '../FBAttachmentNamePresenter';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  employeeId: string
  name: string
}

const Editor: React.FC<Props> = ({ dataItem, employeeEvidenceUpdates, employeeId, name, disabled }) => {
  const classes = styles();
  const { fileUploadState } = FB.useStores();
  React.useEffect(() => {
    const disposer = reaction(
      () => fileUploadState?.files,
      (files) => {
        if (!isEmpty(files)) {
          (fileUploadState as FBFileUploadState).files = [];
          employeeEvidenceUpdates?.(dataItem, employeeId, files?.[0]?.id as string);
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
      disabled={disabled}
      name={name}
    />);
};

export const UploadEvidenceCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, employeeEvidenceUpdates, currentState } = props;
  const classes = styles();
  const assigneList = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const currentUserId = useSelector(authSelectors.currentEmployeeId);
  const isClosedAR = currentState === ChangeRequestStatus.Closed;
  const showEditor = (employeeId, status) => currentUserId === employeeId && !isClosedAR && status !== EmployeeStatus.Done;

  return (<>
    {assigneList?.map(({ employeeId, attachmentId, status, name }) => {
      const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);
      return <div className={classes.employeeResponseFields}>
        {(!attachmentId && showEditor(employeeId, status)) ? (<FBProvider {...{ fileUploadState }}>
          <Editor {...props} {...{ employeeId, name } } />
        </FBProvider>)
          : (!attachmentId) ? EMPTY_VALUE_PLACEHOLDER : <FBAttachmentNamePresenter {...{ files: [{ id: attachmentId }], dataItem, employeeEvidenceUpdates, employeeId, status, disabled: !showEditor(employeeId, status) }} boxProps={{ className: classes.attachmentName }} />}
      </div>;
    })}
  </>);
};
