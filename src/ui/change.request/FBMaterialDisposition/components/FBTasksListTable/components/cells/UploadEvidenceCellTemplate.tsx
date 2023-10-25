import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { FB, FBFileField, FBFileUploadState, FBProvider } from '../../../../../../form.builder';
import { ASSIGNEE_ATTACHMENT_FIELD, EmployeeStatus, EMPLOYEE_RESPONSE_FIELD, EMPTY_VALUE_PLACEHOLDER } from '../../constants';
import { CustomTemplateProps } from '../../interface';
import FBAttachmentNamePresenter from '../FBAttachmentNamePresenter';
import { styles } from './styles';

const Editor: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const { setFieldValue } = useFormikContext();
  const classes = styles();
  const { fileUploadState } = FB.useStores();

  React.useEffect(() => {
    const disposer = reaction(
      () => fileUploadState?.files,
      (files) => {
        if (!isEmpty(files)) {
          setFieldValue(field, files);
          (fileUploadState as FBFileUploadState).files = [];
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
    />);
};

export const UploadEvidenceCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem } = props;
  const classes = styles();
  const { values } = useFormikContext();
  const assigneList = get(dataItem, EMPLOYEE_RESPONSE_FIELD, []);
  const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);
  return (<>
    {assigneList?.map(({ employeeId, attachmentId, status }) => {
      const field = `${ASSIGNEE_ATTACHMENT_FIELD}.${employeeId}`;
      const value = get(values, field, null);
      return <div className={classes.employeeResponseFields}>
        {(!value && !(status === EmployeeStatus.Done)) ? (<FBProvider {...{ fileUploadState }}>
          <Editor {...props} {...{ field } } />
        </FBProvider>)
          : (!attachmentId && !value) ? EMPTY_VALUE_PLACEHOLDER : <FBAttachmentNamePresenter {...{ files: value ?? [{ id: attachmentId }] }} boxProps={{ className: classes.attachmentName }} />}
      </div>;
    })}
  </>);
};
