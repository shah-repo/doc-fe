import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography } from '@material-ui/core';
import PostAddTwoToneIcon from '@material-ui/icons/PostAddTwoTone';
import { Formik } from 'formik';
import { noop } from 'lodash';
import React, { useState } from 'react';
import { translate } from '../../../common/intl';
import { DocumentType } from '../../../state/ducks/documentRevisions/documentType/types';
import { FormContext } from '../../components/forms/FormContext';
import Text from '../../components/Text';
import { styles } from '../../documentType/dialogs/FormListDialog/FormListDialog.styles';
import DocIdInputNew from '../forms/presenters/DocIdInput.new';

interface CustomIdDialogProps {
  isOpen: boolean
  closeDialog: () => void
  outputDocumentType: DocumentType
  isInternalTypeNumbering: boolean
  handleSubmit: (docId: string) => void
}

const CustomIdDialog: React.FC<CustomIdDialogProps> = ({
  isOpen,
  closeDialog,
  outputDocumentType,
  isInternalTypeNumbering,
  handleSubmit,
}) => {
  const classes = styles();

  const [docId, setDocId] = useState<string>('');

  const isDocIdVisibleFalse = outputDocumentType?.fieldsConfig?.F?.visible === false;
  const helpText = isDocIdVisibleFalse ? translate('document.revision.user.numbering.help.doc.id.visible.false')
    : translate('document.revision.user.numbering.help');

  const handleDocIdUpdated = (updatedDocId: string) => {
    if (!updatedDocId.length) {
      setDocId('');
    } else {
      setDocId(`${outputDocumentType?.documentTypeAcronym}${updatedDocId}`);
    }
  };

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik initialValues={{}} onSubmit={noop}>
        {isOpen && outputDocumentType
        && <Dialog
          open={isOpen}
          onClose={closeDialog}
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
                  <Text message={outputDocumentType.documentTypeName} />
                </Typography>
              </Grid>
            </Grid>
          </DialogTitle>
          <DialogContent classes={{ root: classes.dialogContent }} className={classes.relativePos}>
            {!isInternalTypeNumbering && (
              <>
                <DocIdInputNew
                  documentTypeId={outputDocumentType.id}
                  documentAcronym={outputDocumentType.documentTypeAcronym}
                  isDisabled={false}
                  docId=""
                  isShownOnDialog={true}
                  handleDocIdUpdated={handleDocIdUpdated}
                  helpText={helpText}
                />
              </>
            )}
            <DialogActions>
              <Button
                variant="text"
                color="secondary"
                className={classes.cancelButton}
                onClick={closeDialog}
                id="CustomIdDialog-cancelButton"
                data-cy="suggest-form-cancel-btn"
              >
                <Text translation="common.cancel" />
              </Button>
              <Button
                color="primary"
                variant="contained"
                className={classes.submitButton}
                onClick={e => handleSubmit(docId)}
                id="CustomIdDialog-submitButton"
                data-cy="suggest-form-submit-btn"
              >
                <Text translation="common.confirm" />
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
        }
      </Formik>
    </FormContext.Provider>
  );
};

export default CustomIdDialog;
