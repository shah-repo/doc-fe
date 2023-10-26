import { get, isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { FB, FBFileField, FBFileUploadState, FBProvider } from '../../../../../../form.builder';
import { EmployeeStatus, EMPLOYEE_RESPONSE_FIELD, EMPTY_VALUE_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../interface';
import FBAttachmentNamePresenter from '../FBAttachmentNamePresenter';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  employeeId: string
}

const Editor: React.FC<Props> = ({ dataItem, employeeEvidenceUpdates, employeeId, disabled }) => {
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
  }, []);

  return (
    <FBFileField className={classes.uploadEvidenceField}
      labelClassName={classes.uploadEvidenceFieldLabel}
      iconClassName={classes.uploadEvidenceFieldIcon}
      disabled={disabled}
    />);
};

export const UploadEvidenceCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, employeeEvidenceUpdates } = props;
  const classes = styles();
  const assigneList = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);
  return (<>
    {assigneList?.map(({ employeeId, attachmentId, status }) => {
      return <div className={classes.employeeResponseFields}>
        {(!attachmentId && !(status === EmployeeStatus.Done)) ? (<FBProvider {...{ fileUploadState }}>
          <Editor {...props} {...{ employeeId } } />
        </FBProvider>)
          : (!attachmentId) ? EMPTY_VALUE_PLACEHOLDER : <FBAttachmentNamePresenter {...{ files: [{ id: attachmentId }], dataItem, employeeEvidenceUpdates, employeeId, status }} boxProps={{ className: classes.attachmentName }} />}
      </div>;
    })}
  </>);
};
