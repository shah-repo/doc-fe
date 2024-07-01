import { useFormikContext } from 'formik';
import { get, isEmpty } from 'lodash';
import { reaction } from 'mobx';
import React from 'react';
import { FB, FBFileField, FBFileUploadState, FBProvider } from '../..';
import { Attachment } from '../../../../state/ducks/attachments/types';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps, EditableCertification } from '../types';
import FBAttachmentNamePresenter from './FBAttachmentNamePresenter';
import { styles } from './styles';

interface Props extends CustomTemplateProps {
  previousAttachments: Attachment[]
}

const Editor: React.FC<Props> = ({ field, dataItem, previousAttachments }) => {
  const classes = styles();
  const { setFieldValue, values } = useFormikContext<EditableCertification>();
  const { fileUploadState } = FB.useStores();
  const { id } = dataItem ?? values;

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
          setFieldValue(field, attachments);
        }
      },
    );
    return () => {
      disposer();
    };
  }, [dataItem, previousAttachments]);

  return (
    <FBFileField className={classes.uploadAttachmentField}
      name={id}
      iconClassName={classes.uploadAttachmentFieldIcon}
      labelClassName={classes.uploadAttachmentFieldLabel}
    />);
};

export const AttachmentCell: React.FC<CustomTemplateProps> = (props) => {
  const { dataItem = {}, field } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const { values } = useFormikContext<EditableCertification>();
  const classes = styles();
  const defaultAttachments = dataItem[field] as Attachment[];
  const attachments = defaultAttachments ?? get(values, field, []);
  const fileUploadState = FB.useRef<FBFileUploadState>(FBFileUploadState);

  return (<>
    <div>
      <FBProvider {...{ fileUploadState }}>
        {isEditMode && (
          <Editor {...props} {...{ previousAttachments: attachments } } />
        )}
        { isEmpty(attachments) ? EMPTY_VALUE_PLACEHOLDER : <FBAttachmentNamePresenter {...{ files: attachments, fileUploadState }} boxProps={{ className: classes.attachmentsContainer }} />}
      </FBProvider>
    </div>
  </>);
};
