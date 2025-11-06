import { useFormikContext } from 'formik';
import { isEmpty, pick } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { Attachment } from '../../../../../state/ducks/attachments/types';
import FBFileField from '../../../FBFileField/FBFileField';
import FBFileUploadState from '../../../FBFileUpload/FBFileUpload.state';
import FBProvider from '../../../FBProvider/FBProvider';
import { FB } from '../../../helpers';
import { ADD_FIELD, CELL_EMPTY_VALUE, MODE_FIELD } from '../constants';
import { CustomTreeListCellProps, EditableMaterial } from '../types';
import AttachmentNamePresenter from './AttachmentNamePresenter';
import { styles } from './styles';
import TreeListCellWrapper from './TreeListCellWrapper';

interface Props extends CustomTreeListCellProps {
  previousAttachments: Attachment[]
}

const Editor: React.FC<Props> = ({ dataItem, isDisabled, previousAttachments, hasChildren, field = '' }) => {
  const classes = styles({ hasChildren });
  const { fileUploadState } = FB.useStores();
  const { setFieldValue } = useFormikContext<EditableMaterial>();

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
          const updatedAttachments = attachments?.map((item) => pick(item, ['id']));
          setFieldValue(field, updatedAttachments);
        }
      },
    );
    return () => {
      disposer();
    };
  }, [dataItem]);

  return (
    <FBFileField
      className={classes.attachmentField}
      labelClassName={classes.attachmentFieldLabel}
      iconClassName={classes.attachmentFieldIcon}
      disabled={isDisabled}
      name={dataItem?.id}
      forceFileUpload
    />
  );
};

export const Attachments: React.FC<CustomTreeListCellProps> = (props) => {
  const { dataItem, isDisabled, field = '', hasChildren } = props;
  const { values } = useFormikContext<EditableMaterial>();
  const isEditMode = (dataItem[MODE_FIELD] || dataItem[ADD_FIELD]) && !dataItem.lotId && !dataItem?.isLotAddition;
  const attachments = (isEditMode ? values[field] : dataItem?.attachments) ?? [];
  const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);
  const classes = styles({ hasChildren });

  return (
    <TreeListCellWrapper {...props}>
      <FBProvider {...{ fileUploadState }}>
        {isEditMode && <Editor {...props} {...{ previousAttachments: attachments, isDisabled, field }} />}
        {!attachments.length ? (
          !isEditMode && CELL_EMPTY_VALUE
        ) : (
          <AttachmentNamePresenter
            {...{ files: attachments, isDisabled: !isEditMode || isDisabled, fileUploadState }}
            boxProps={{ className: classes.attachmentsContainer }}
          />
        )}
      </FBProvider>
    </TreeListCellWrapper>
  );
};
