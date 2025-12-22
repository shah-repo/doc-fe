import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import PostAddTwoToneIcon from '@material-ui/icons/PostAddTwoTone';
import { FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../common/intl';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DOCUMENT_NUMBERING_STYLE, DocumentType, DocumentTypeByIdForm } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import Text from '../../components/Text';
import FormWrapper from '../../components/forms/FormWrapper';
import AutocompleteField from '../../components/forms/fields/Autocomplete/Autocomplete';
import DocIdInputNew from '../../documentRevision/forms/presenters/DocIdInput.new';
import { checkIsDocumentLHRT } from '../../documentRevision/helpers/checkDocumentGroup';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { styles } from './FormListDialog/FormListDialog.styles';

interface DocumentTypeDialogProps extends FormikProps<any> {
  documentTypes: DocumentType[]
  formIds: DocumentTypeByIdForm[]
  numberingStyle?: DOCUMENT_NUMBERING_STYLE
  areFormIdsLoading?: boolean
  dialog: DialogHandler
  handleSelection: (id: string) => void
  handleTemplateSelection?: (id: string) => void
  handleUserSubmit?: (docId: string) => void
  isRecord: boolean
  closeMultipleFormDialog: () => void
  isLHR: boolean
}

const MultipleFormTemplateDialog: React.FunctionComponent<DocumentTypeDialogProps> = ({
  dialog,
  formIds,
  numberingStyle,
  areFormIdsLoading = false,
  documentTypes,
  handleSelection,
  handleTemplateSelection,
  handleUserSubmit,
  initialValues,
  dirty,
  resetForm,
  isRecord,
  closeMultipleFormDialog,
  isLHR,
}) => {
  const classes = styles();

  const [parts, setParts] = useState<DocumentRevision[]>([]);

  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>();
  const [docId, setDocId] = useState<string>('');

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchAvailableParts);

  const activeDocTypes = documentTypes.filter((type) => type.active);
  const isCustomerTypeNumbering = numberingStyle === DOCUMENT_NUMBERING_STYLE.CUSTOMER;

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setParts(data);
    },
  });

  useEffect(() => {
    if (activeDocTypes?.length === 1) {
      setSelectedDocumentType(activeDocTypes[0]);
    }
  }, [activeDocTypes]);

  useEffect(() => {
    if (!isLHR) {
      return;
    }

    fetchAvailablePartsAsync.start(
      fetchAvailablePartsAction,
      fetchAvailablePartsAsync,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLHR]);

  const checkForPart = (form: DocumentTypeByIdForm) => {
    const id = form.formTemplate?.schema?.find((item) => item.name === 'lhr-selected-part')?.editorConfig?.id;
    return parts.find((part) => part.document.id === id && part.status === DocumentRevisionStatus.Released);
  };

  const renderPartLabel = (form: DocumentTypeByIdForm) => {
    const partDocRev = checkForPart(form);

    if (!partDocRev) {
      return form.name;
    }
    return `(${partDocRev?.document.docId} rev ${partDocRev?.displayRevision} - ${partDocRev?.name}) ${form.name}`;
  };

  const renderOptions = () => {
    if (!isLHR) {
      return formIds.map((form) => ({
        label: form.name,
        value: form.id,
      }));
    }

    const LHRForms = formIds.filter((form) => {
      const partDocRev = checkForPart(form);
      const isLHRT = checkIsDocumentLHRT(form.document.documentType?.groupOptions);

      return (isLHRT && partDocRev) || (!isLHRT && !partDocRev);
    });

    return LHRForms.map((form) => ({
      label: renderPartLabel(form),
      value: form.id,
    }));
  };

  const shouldDisplayLoader
    = !documentTypes
      || documentTypes.length === 0
      || (documentTypes.length === 1 && (!formIds || formIds?.length === 0));

  const onDocumentTypeSelected = (value) => {
    setSelectedDocumentType(activeDocTypes.find(docType => docType.id === value));
    handleSelection(value);
  };

  const handleDocIdUpdated = (updatedDocId: string) => {
    setDocId(`${selectedDocumentType?.documentTypeAcronym}${updatedDocId}`);
  };

  return (
    <>
      {dialog.isOpen
      && <Dialog
        open={dialog.isOpen}
        onSubmit={preventPropagation}
        onClose={closeMultipleFormDialog}
        classes={{ paper: classes.dialogPaper }}
      >
        {!shouldDisplayLoader ? (
          <>
            <DialogTitle>
              <Grid container className={classes.containerWrap}>
                <Grid item xs={2} className={classes.gridWrap}>
                  <span className={classes.iconContainer}>
                    <PostAddTwoToneIcon className={classes.icon} />
                  </span>
                </Grid>
                <Grid item xs={10}>
                  <Typography variant="h6">
                    <Text translation={isRecord ? 'record.select.type' : 'supplier.select.type' } />
                  </Typography>
                  <Typography variant="h5">
                    <Text translation={isRecord ? 'record.select.create.title' : 'document.select.create.title'} />
                  </Typography>
                </Grid>
              </Grid>
            </DialogTitle>
            <DialogContent classes={{ root: classes.dialogContent }} style={{ position: 'relative' }}>
              <FormWrapper
                dirty={dirty}
                initialValues={initialValues}
                resetForm={resetForm}
              >
                <AutocompleteField
                  name="selectType"
                  size="sm"
                  autocompleteProps={{
                    id: 'MultipleFormTemplate-selectDocForm',
                    isLoading: areFormIdsLoading,
                  }}
                  isDisabled={areFormIdsLoading}
                  options={activeDocTypes.map((docType) => ({
                    label: docType.documentTypeName,
                    value: docType.id,
                  }))}
                  onClick={(option) => onDocumentTypeSelected(option.value)}
                  label={isRecord ? 'record.select.type' : 'supplier.select.type' }
                  data-cy={isRecord ? 'record.select.type' : 'supplier.select.type' }
                />
                {formIds.length > 1 && (
                  <AutocompleteField
                    isDisabled={areFormIdsLoading}
                    name="selectForm"
                    size="sm"
                    autocompleteProps={{ id: 'MultipleFormTemplate-selectDocType' }}
                    options={renderOptions()}
                    onClick={(option) => handleTemplateSelection?.(option.value)}
                    label={isRecord ? 'record.select.template' : 'supplier.select.form'}
                    data-cy={isRecord ? 'record.select.template' : 'supplier.select.form'}
                  />
                )}
                {isCustomerTypeNumbering && selectedDocumentType && (
                  <>
                    <DocIdInputNew
                      documentTypeId={selectedDocumentType.id}
                      documentAcronym={selectedDocumentType.documentTypeAcronym}
                      isDisabled={false}
                      docId=""
                      numberingStyle={numberingStyle}
                      isShownOnDialog={true}
                      handleDocIdUpdated={handleDocIdUpdated}
                    />
                    <Typography variant="caption" className={classes.docIdHelpText}>
                      {translate('document.revision.user.numbering.help')}
                    </Typography>
                  </>
                )}
                <DialogActions>
                  <Button
                    variant="text"
                    color="secondary"
                    className={classes.cancelButton}
                    onClick={closeMultipleFormDialog}
                    id="DocTypeListDialog-cancelButton"
                    data-cy="suggest-form-cancel-btn"
                  >
                    <Text translation="common.cancel" />
                  </Button>
                  { isCustomerTypeNumbering && <Button
                    color="primary"
                    variant="contained"
                    className={classes.submitButton}
                    onClick={e => handleUserSubmit?.(docId)}
                    id="DocTypeListDialog-submitButton"
                    data-cy="suggest-form-submit-btn"
                  >
                    <Text translation="common.confirm" />
                  </Button> }
                </DialogActions>
              </FormWrapper>
            </DialogContent>
          </>
        ) : (
          <DialogContent classes={{ root: classes.dialogContent }} style={{ position: 'relative' }}>
            <Box className={classes.loading}>
              <CircularProgress size={20} />
              <Text translation="common.loading" />
            </Box>
          </DialogContent>
        )}
      </Dialog>
      }
    </>
  );
};

export default MultipleFormTemplateDialog;
