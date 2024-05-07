import { get, isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { FB, FBFileField, FBFileUploadState, FBProvider } from '../..';
import { Attachment } from '../../../../state/ducks/attachments/types';
import FBAttachmentNamePresenter from '../../../change.request/FBMaterialDisposition/components/FBTasksListTable/components/FBAttachmentNamePresenter';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  name: string
  previousAttachments: Attachment[]
  attachmentsUpdates?: any
}

const Editor: React.FC<Props> = ({ dataItem, attachmentsUpdates, previousAttachments }) => {
  const classes = styles();
  const { fileUploadState } = FB.useStores();
  const { id } = dataItem;

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
          attachmentsUpdates?.(dataItem, attachments as Attachment[]);
        }
      },
    );
    return () => {
      disposer();
    };
  }, [dataItem, attachmentsUpdates]);

  return (
    <FBFileField className={classes.uploadEvidenceField}
      labelClassName={classes.uploadEvidenceFieldLabel}
      iconClassName={classes.uploadEvidenceFieldIcon}
      disabled={true}
      name={id}
    />);
};

export const AttachmentsCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, column, field } = props;
  const { editable } = column;

  const classes = styles();
  const attachments = get(dataItem, field, []);
  const mode = get(dataItem, MODE_FIELD);
  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  return (
    <>
      {attachments?.map(({ id, name }) => {
        const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);
        return (
          <div key={id} className={classes.employeeResponseFields}>
            <FBProvider {...{ fileUploadState }}>
              {canBeModified && (
                <Editor
                  {...props}
                  name={name}
                  previousAttachments={attachments}
                />
              )}
              {Boolean(attachments.length) && (
                <FBAttachmentNamePresenter
                  boxProps={{ className: classes.attachmentsContainer }}
                  files={attachments}
                  fileUploadState={fileUploadState}
                  isDisabled={!canBeModified}
                />
              )}
              {!attachments.length && EMPTY_VALUE_PLACEHOLDER}
            </FBProvider>
          </div>
        );
      })}
    </>
  );
};
