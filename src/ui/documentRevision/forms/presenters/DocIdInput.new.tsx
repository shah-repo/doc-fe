import { InputAdornment } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DOCUMENT_NUMBERING_STYLE } from '../../../../state/ducks/documentRevisions/documentType/types';
import { documentsSelectors } from '../../../../state/ducks/documents';
import { AsyncStatus } from '../../../../state/types';
import InputField from '../../../components/forms/fields/Input';
import { toastError } from '../../../components/notifications';
import { styles as AutoCompleteStyles } from '../../../form.builder/styles/FBAutocomplete.styles';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import { useDocId } from '../../../hooks/docCustomization/useCustomization';
import { styles } from './styles/DocIdInput.styles';

interface Props {
  isDisabled: boolean
  docId?: string
  documentAcronym: string
  documentTypeId?: string
  numberingStyle?: DOCUMENT_NUMBERING_STYLE
  isShownOnDialog?: boolean
  handleDocIdUpdated?: (docId: string) => void
}

const DocIdInputNew: React.FunctionComponent<Props> = ({
  documentTypeId = '',
  isDisabled,
  docId = '',
  documentAcronym,
  numberingStyle,
  isShownOnDialog = false,
  handleDocIdUpdated,
}) => {
  const classes = styles();
  const loadProposedDocIdState = useSelector(documentsSelectors.getLoadProposedDocIdAsyncState);

  const [docIdEntered, setDocIdEntered] = useState<string>(docId);
  useEffect(() => {
    if (loadProposedDocIdState.status === AsyncStatus.Error) {
      toastError(loadProposedDocIdState.message);
    }
  }, [loadProposedDocIdState]);
  const { isVisible, label, tooltipConfig, validation: validators } = useDocId(documentTypeId);

  const handleDocIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDocIdEntered(value);

    if (handleDocIdUpdated) {
      handleDocIdUpdated(value);
    }
  };

  if (!isVisible && !isShownOnDialog) {
    return null;
  }

  return (
    <CustomLabelTooltip {...{ tooltipConfig }}>
      <InputField
        name="document.docId"
        label={label}
        inputProps={{
          id: 'document.docId',
          value: docIdEntered,
          disabled: isDisabled,
          onChange: handleDocIdChange,
          startAdornment: <InputAdornment position="start">{documentAcronym}</InputAdornment>,
        }}
        validate={validators}
        inputStyleProps={classes.input}
        labelProps={AutoCompleteStyles.labelStyle}
      />
    </CustomLabelTooltip>
  );
};

export default DocIdInputNew;
