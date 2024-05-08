import { get, isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React, { useEffect } from 'react';
import { FB, FBFileField, FBFileUploadState, FBProvider } from '../..';
import { Attachment } from '../../../../state/ducks/attachments/types';
import FBAttachmentNamePresenter from '../../../change.request/FBMaterialDisposition/components/FBTasksListTable/components/FBAttachmentNamePresenter';
import { MODE_FIELD, Mode } from '../../FBApprovalMatrixRoles/constants';
import { CustomTemplateProps, EditableTrainee, TraineeAttachment } from '../types';
import { styles } from './styles';

// @todo
const ATTACHMENTS = [
  // {
  //   company: {
  //     id: 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
  //     addresses: [],
  //     acctCodes: [],
  //   },
  //   lineType: 'CLEAN_COPY',
  //   importMetadataJson: {},
  //   name: 'Screenshot1',
  //   type: 'png',
  //   s3link: 'cdce82eb-bf68-481e-af5f-f9c16853d7c0/2024-05-07T14:14:26.473Z/Screenshot 2024-05-04 at 02.33.02.png',
  //   owner: {
  //     id: '19ff9184-4de6-4a1d-b0a1-9315510fc562',
  //   },
  //   fileSizeS3Link: 397579,
  //   cleanCopyStatus: 'NOT_REQUIRED',
  //   companyId: 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
  //   description: null,
  //   version: null,
  //   s3linkCleanCopy: null,
  //   fileSizeS3LinkCleanCopy: null,
  //   createdAt: '2024-05-07T14:14:26.472Z',
  //   updatedAt: '2024-05-07T14:14:26.472Z',
  //   id: 'a4aed129-a14c-4aef-a546-a25fc2c19e4f',
  //   billIds: [],
  //   isComplete: true,
  // },
  // {
  //   company: {
  //     id: 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
  //     addresses: [],
  //     acctCodes: [],
  //   },
  //   lineType: 'CLEAN_COPY',
  //   importMetadataJson: {},
  //   name: 'Screenshot2',
  //   type: 'png',
  //   s3link: 'cdce82eb-bf68-481e-af5f-f9c16853d7c0/2024-05-07T14:14:26.473Z/Screenshot 2024-05-04 at 02.33.02.png',
  //   owner: {
  //     id: '19ff9184-4de6-4a1d-b0a1-9315510fc562',
  //   },
  //   fileSizeS3Link: 397579,
  //   cleanCopyStatus: 'NOT_REQUIRED',
  //   companyId: 'cdce82eb-bf68-481e-af5f-f9c16853d7c0',
  //   description: null,
  //   version: null,
  //   s3linkCleanCopy: null,
  //   fileSizeS3LinkCleanCopy: null,
  //   createdAt: '2024-05-07T14:14:26.472Z',
  //   updatedAt: '2024-05-07T14:14:26.472Z',
  //   id: 'a4aed129-a14c-4aef-a546-a25fc2c19e4f',
  //   billIds: [],
  //   isComplete: true,
  // },
];

interface Props extends CustomTemplateProps {
  dataItem: EditableTrainee
  previousAttachments: TraineeAttachment[]
  attachmentsUpdates?: any
}

const Editor: React.FC<Props> = ({ dataItem, attachmentsUpdates, previousAttachments }) => {
  const classes = styles();
  const { fileUploadState } = FB.useStores();
  const { id } = dataItem;

  useEffect(() => {
    if (!isEmpty(previousAttachments)) {
      fileUploadState?.setAttachments(previousAttachments as Attachment[]);
    }
  }, []);

  useEffect(() => {
    const disposer = reaction(
      () => fileUploadState?.attachments,
      (attachments) => {
        if (attachments?.length !== previousAttachments.length) {
          attachmentsUpdates?.(dataItem, attachments);
        }
      },
    );
    return () => {
      disposer();
    };
  }, [dataItem, attachmentsUpdates]);

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

  const attachments = get(dataItem, field, ATTACHMENTS ?? []);
  const mode = get(dataItem, MODE_FIELD);
  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

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
      </div>
      {canBeModified && (
        <Editor
          {...props}
          previousAttachments={attachments}
        />
      )}
    </FBProvider>
  );
};
