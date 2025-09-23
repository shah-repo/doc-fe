import { isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { Attachment } from '../../../../../state/ducks/attachments/types';
import FBFileField from '../../../FBFileField/FBFileField';
import FBFileUploadState from '../../../FBFileUpload/FBFileUpload.state';
import FBProvider from '../../../FBProvider/FBProvider';
import { FB } from '../../../helpers';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD } from '../constants';
import { CustomTreeListCellProps } from '../types';
import AttachmentNamePresenter from './AttachmentNamePresenter';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';

interface Props extends CustomTreeListCellProps {
  previousAttachments: Attachment[]
}

const Editor: React.FC<Props> = ({ dataItem, isDisabled, previousAttachments, hasChildren }) => {
  const classes = styles({ hasChildren });
  const { fileUploadState } = FB.useStores();
  const { id: taskId } = dataItem; // TODO check and modify

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
          // employeeEvidenceUpdates?.(dataItem, employeeId, attachments as Attachment[]);
        }
      },
    );
    return () => {
      disposer();
    };
  }, [dataItem]);

  return (
    <FBFileField className={classes.uploadEvidenceField}
      labelClassName={classes.uploadEvidenceFieldLabel}
      iconClassName={classes.uploadEvidenceFieldIcon}
      disabled={isDisabled}
      name={taskId}
      forceFileUpload
    />);
};

const FileUploadStateWrapper = ({ children }) => {
  const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);

  return (
    <FBProvider {...{ fileUploadState }}>
      {children}
    </FBProvider>
  );
};

export const Attachments: React.FC<CustomTreeListCellProps> = (props) => {
  const { dataItem, isDisabled } = props;
  // const classes = styles({ hasChildren });
  const attachments = dataItem?.attachments ?? [];
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && !dataItem.lotId && !dataItem?.isLotAddition;
  // const currentUserId = useSelector(authSelectors.currentEmployeeId);
  const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);

  return (<TreeListCellWrapper {...props}>
    <FileUploadStateWrapper>
      {isEditMode && <Editor {...props} {...{ previousAttachments: attachments, isDisabled }} />}
      {!attachments.length ? (
        !isEditMode && CELL_EMPTY_VALUE
      ) : (
        <AttachmentNamePresenter
          {...{ files: attachments, isDisabled: !isEditMode || isDisabled, fileUploadState }}
        />
      )}
    </FileUploadStateWrapper>
  </TreeListCellWrapper>);
};
