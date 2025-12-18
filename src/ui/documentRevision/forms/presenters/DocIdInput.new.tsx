import { InputAdornment } from '@material-ui/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { DOCUMENT_NUMBERING_STYLE } from '../../../../state/ducks/documentRevisions/documentType/types';
import { documentsSelectors } from '../../../../state/ducks/documents';
import { DocumentProposedIdSetAction } from '../../../../state/ducks/documents/types';
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
  setDocId?: ((docId: string) => DocumentProposedIdSetAction) | undefined
}

const DocIdInputNew: React.FunctionComponent<Props> = ({
  documentTypeId = '',
  isDisabled,
  docId,
  documentAcronym,
  numberingStyle,
  isShownOnDialog = false,
  setDocId,
}) => {
  const classes = styles();
  const loadProposedDocIdState = useSelector(documentsSelectors.getLoadProposedDocIdAsyncState);
  React.useEffect(() => {
    if (loadProposedDocIdState.status === AsyncStatus.Error) {
      toastError(loadProposedDocIdState.message);
    }
  }, [loadProposedDocIdState]);
  const { isVisible, label, tooltipConfig, validation: validators } = useDocId(documentTypeId);
  const handleDocIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (setDocId) {
      setDocId(value);
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
          value: docId,
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
