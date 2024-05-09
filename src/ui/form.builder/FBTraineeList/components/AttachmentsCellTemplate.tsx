import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React, { useEffect } from 'react';
import { FB, FBFileField, FBFileUploadState, FBProvider } from '../..';
import { Attachment } from '../../../../state/ducks/attachments/types';
import FBAttachmentNamePresenter from '../../../change.request/FBMaterialDisposition/components/FBTasksListTable/components/FBAttachmentNamePresenter';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { CustomTemplateProps, EditableTrainee, TraineeAttachment } from '../types';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  dataItem: EditableTrainee
  previousAttachments: TraineeAttachment[]
  onUpdate: (attachments: TraineeAttachment[]) => void
}

const Editor: React.FC<Props> = ({ dataItem, field, previousAttachments, onUpdate }) => {
  const classes = styles();
  const { fileUploadState } = FB.useStores();
  const { id } = dataItem;

  useEffect(() => {
    if (!isEmpty(previousAttachments)) {
      fileUploadState?.setAttachments(previousAttachments as Attachment[]);
    }
  }, [previousAttachments]);

  useEffect(() => {
    const disposer = reaction(
      () => fileUploadState?.attachments,
      (attachments) => {
        if (attachments?.length !== previousAttachments.length) {
          fileUploadState?.setAttachments(attachments ?? []);
          onUpdate(attachments ?? []);
        }
      },
    );
    return () => {
      disposer();
    };
  }, [dataItem, onUpdate]);

  return (
    <FBFileField
      className={classes.uploadField}
      labelClassName={classes.uploadFieldLabel}
      iconClassName={classes.uploadFieldIcon}
      name={id}
    />
  );
};

export const AttachmentsCellTemplate: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem, column, field } = props;
  const { editable } = column;

  const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);
  const classes = styles();
  const { values, setFieldValue } = useFormikContext<EditableTrainee>() ?? {};

  const handleUpdate = (attachments) => {
    setFieldValue('attachmentIds', attachments?.map(item => item.id) ?? []);
    setFieldValue(field, attachments ?? []);
  };

  const mode = get(dataItem, MODE_FIELD);
  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;
  const attachments = (
    canBeModified
      ? (values[field] ?? [])
      : get(dataItem, field, [])
  ) as TraineeAttachment[];

  return (
    <FBProvider {...{ fileUploadState }}>
      <div className={classes.attachmentsList}>
        {attachments?.map((attachment) => {
          return (
            <FBAttachmentNamePresenter
              key={attachment.id}
              boxProps={{ className: classes.attachmentsContainer }}
              attachments={[attachment]}
              fileUploadState={fileUploadState}
              isDisabled={!canBeModified}
            />
          );
        })}
        {canBeModified && (
          <Editor
            {...props}
            previousAttachments={attachments}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </FBProvider>
  );
};
