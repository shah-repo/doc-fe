import { InputAdornment } from '@material-ui/core';
import { useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DOCUMENT_NUMBERING_STYLE } from '../../../../state/ducks/documentRevisions/documentType/types';
import { documentsActions, documentsSelectors } from '../../../../state/ducks/documents';
import { DocIdRequestBody } from '../../../../state/ducks/documents/types';
import { AsyncStatus } from '../../../../state/types';
import InputField from '../../../components/forms/fields/Input';
import { toastError } from '../../../components/notifications';
import { styles as AutoCompleteStyles } from '../../../form.builder/styles/FBAutocomplete.styles';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import { useDocId } from '../../../hooks/docCustomization/useCustomization';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { styles } from './styles/DocIdInput.styles';

interface Props {
  isDisabled: boolean
  docId?: string
  documentAcronym: string
  documentTypeId?: string
  numberingStyle?: DOCUMENT_NUMBERING_STYLE
  isShownOnDialog?: boolean
  documentId?: string
  helpText?: string
  handleDocIdUpdated?: (docId: string) => void
}

const DocIdInputNew: React.FunctionComponent<Props> = ({
  documentTypeId = '',
  isDisabled,
  docId = '',
  documentAcronym,
  numberingStyle,
  isShownOnDialog = false,
  documentId,
  helpText,
  handleDocIdUpdated,
}) => {
  const classes = styles();
  const loadProposedDocIdState = useSelector(documentsSelectors.getLoadProposedDocIdAsyncState);

  const formik = useFormikContext();

  const [docIdEntered, setDocIdEntered] = useState<string>(docId);
  const [isRequestInProgress, setIsRequestInProgress] = useState<boolean>(false);

  useEffect(() => {
    if (loadProposedDocIdState.status === AsyncStatus.Error) {
      toastError(loadProposedDocIdState.message);
    }
  }, [loadProposedDocIdState]);
  const { isVisible, label, tooltipConfig, validation: validators } = useDocId(documentTypeId);

  const sendDocIdUpdateRequestAction = useActionCreator(documentsActions.sendDocIdUpdateRequest);
  const sendDocIdUpdateRequestAsync = useAsync({
    onSuccess: () => {
      setIsRequestInProgress(false);
    },
    onError: (message: string | undefined) => {
      setIsRequestInProgress(false);
      toastError(message);
    },
  });

  const handleDocIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDocIdEntered(value);

    if (handleDocIdUpdated) {
      handleDocIdUpdated(value);
    }
  };

  const handleDocIdBlur = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    if (!isShownOnDialog) {
      // Make a call to update the docId on the document
      if (documentId) {
        const body: DocIdRequestBody = {
          docId: `${documentAcronym}${value}`,
        };
        setIsRequestInProgress(true);
        sendDocIdUpdateRequestAsync.start(
          sendDocIdUpdateRequestAction,
          documentId,
          body,
          sendDocIdUpdateRequestAsync,
        );
      } else {
        formik.setFieldValue('document.docId', `${documentAcronym}${value}`);
      }
    }
  };

  if (!isVisible && !isShownOnDialog) {
    return null;
  }

  const inputProps = {
    id: 'document.docId',
    disabled: isDisabled,
    startAdornment: <InputAdornment position="start">{documentAcronym}</InputAdornment>,
    value: docIdEntered,
    onChange: handleDocIdChange,
    onBlur: handleDocIdBlur,
  };

  return (
    <>
      {isRequestInProgress && <span>Updating DocId</span>}
      <CustomLabelTooltip {...{ tooltipConfig }}>
        <InputField
          name="document.docId"
          label={label}
          inputProps={inputProps}
          validate={validators}
          inputStyleProps={classes.input}
          labelProps={AutoCompleteStyles.labelStyle}
          helpText={helpText}
        />
      </CustomLabelTooltip>
    </>
  );
};

export default DocIdInputNew;
