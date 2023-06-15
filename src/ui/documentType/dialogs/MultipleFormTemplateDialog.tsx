import { Button, Dialog, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import PostAddTwoToneIcon from '@material-ui/icons/PostAddTwoTone';
import { FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import { documentRevisionsActions } from '../../../state/ducks/documentRevisions';
import { DocumentType, DocumentTypeByIdForm } from '../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision, DocumentRevisionStatus } from '../../../state/ducks/documentRevisions/types';
import AutocompleteField from '../../components/forms/fields/Autocomplete/Autocomplete';
import FormProgress from '../../components/forms/FormProgress';
import FormWrapper from '../../components/forms/FormWrapper';
import Text from '../../components/Text';
import { checkIsDocumentLHRT } from '../../documentRevision/helpers/checkDocumentGroup';
import useActionCreator from '../../hooks/useActionCreator';
import useAsync from '../../hooks/useAsync';
import { DialogHandler } from '../../hooks/useDialog';
import { docIdAsyncContext } from '../list/CreateDocumentByType';
import { styles } from './FormListDialog/FormListDialog.styles';

interface DocumentTypeDialogProps extends FormikProps<any> {
  documentTypes: DocumentType[]
  formIds: DocumentTypeByIdForm[]
  areFormIdsLoading?: boolean
  dialog: DialogHandler
  handleSelection: (id: string) => void
  handleTemplateSelection: (id: string) => void
  isRecord: boolean
  closeMultipleFormDialog: () => void
  isLHR: boolean
}

const MultipleFormTemplateDialog: React.FunctionComponent<DocumentTypeDialogProps> = ({
  dialog,
  formIds,
  areFormIdsLoading = false,
  documentTypes,
  handleSelection,
  handleTemplateSelection,
  initialValues,
  dirty,
  resetForm,
  isRecord,
  closeMultipleFormDialog,
  isLHR,
}) => {
  const classes = styles();

  const [parts, setParts] = useState<DocumentRevision[]>([]);

  const preventPropagation = (event: React.FormEvent) => event.stopPropagation();
  const fetchAvailablePartsAction = useActionCreator(documentRevisionsActions.fetchAvailableParts);

  const docIdAsyncState = React.useContext(docIdAsyncContext);
  const activeDocTypes = documentTypes.filter((type) => type.active);

  const handleSelect = (id: string) => {
    handleSelection(id);
  };

  const fetchAvailablePartsAsync = useAsync({
    onSuccess: (data: DocumentRevision[] = []) => {
      setParts(data);
    },
  });

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

  return (
    <>
      {dialog.isOpen
      && <Dialog
        open={dialog.isOpen}
        onSubmit={preventPropagation}
        onClose={closeMultipleFormDialog}
        classes={{ paper: classes.dialogPaper }}
      >
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
            <FormProgress asyncState={docIdAsyncState} />
            <AutocompleteField
              name="selectType"
              size="sm"
              autocompleteProps={{
                id: 'MultipleFormTemplate-selectDocForm',
                isLoading: areFormIdsLoading,
              }}
              options={activeDocTypes.map((docType) => ({
                label: docType.documentTypeName,
                value: docType.id,
              }))}
              onClick={(option) => handleSelect(option.value)}
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
                onClick={(option) => handleTemplateSelection(option.value)}
                label={isRecord ? 'record.select.template' : 'supplier.select.form'}
                data-cy={isRecord ? 'record.select.template' : 'supplier.select.form'}
              />
            )}
            <Button
              variant="text"
              color="secondary"
              className={classes.cancelButton}
              onClick={closeMultipleFormDialog}
              id="DocTypeListDialog-cancelButton"
              data-cy="suggestFormCancelBtn"
            >
              <Text translation="transition.action.cancel" />
            </Button>
          </FormWrapper>
        </DialogContent>
      </Dialog>
      }
    </>
  );
};

export default MultipleFormTemplateDialog;
