import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import { Formik } from 'formik';
import { noop } from 'lodash';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as ModelCloseIcon } from '../../../../assets/images/modelClose.svg';
import { ReactComponent as Active } from '../../../../assets/images/radioActive.svg';
import { ReactComponent as InActive } from '../../../../assets/images/radioInActive.svg';
import { translate } from '../../../../common/intl';
import { documentRevisionsActions } from '../../../../state/ducks/documentRevisions';
import { DOCUMENT_NUMBERING_STYLE } from '../../../../state/ducks/documentRevisions/documentType/types';
import { DocumentRevision } from '../../../../state/ducks/documentRevisions/types';
import Text from '../../../components/Text';
import { documentVersionPath } from '../../../document.revision/utils/paths';
import DocIdInputNew from '../../../documentRevision/forms/presenters/DocIdInput.new';
import FBStore from '../../../form.builder/FBStore/FBStore';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { toastError } from '../../notifications';
import { FormContext } from '../FormContext';
import { styles } from './CloneModal.styles';

interface CloneModalProps {
  handleCloneModalClose: () => void
  documentRevision: DocumentRevision
}

const CloneModal: React.FunctionComponent<CloneModalProps> = ({
  handleCloneModalClose,
  documentRevision,
}) => {
  const classes = styles();
  const [value, setValue] = React.useState('false');
  const cloneEB = useActionCreator(documentRevisionsActions.cloneDoc);
  const history = useHistory();

  const documentType = documentRevision?.document.documentType;
  const isInternalTypeNumbering = documentType?.numberingStyle === DOCUMENT_NUMBERING_STYLE.INTERNAL;

  const [docId, setDocId] = useState<string>('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const asyncClone = useAsync({
    onSuccess: (documentRevision: any) => {
      history.push({
        pathname: documentVersionPath(
          documentRevision.id,
          documentRevision.document.id,
        ),
      });
    },
    onError: (error) => {
      toastError(error);
    },
  });

  const payload = {
    decoupleEB: value === 'true',
    docId,
  };

  const cloneAction = () => {
    FBStore.selectedApprover = [];
    asyncClone.start(cloneEB, documentRevision.id, { ...payload }, asyncClone);
  };

  const handleDocIdUpdated = (updatedDocId: string) => {
    if (!updatedDocId.length) {
      setDocId('');
    } else {
      setDocId(`${documentType?.documentTypeAcronym}${updatedDocId}`);
    }
  };

  return (
    <FormContext.Provider value={{ submitOnChange: false }}>
      <Formik initialValues={{}} onSubmit={noop}>
        <Box
          pt={0}
          pl={2.5}
          pb={1.875}
          pr={2.5}
          alignItems="flex-start"
          className={classes.paper}
        >
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            className={classes.header}
          >
            <Grid item>
              <Typography
                variant="h2"
                component="h2"
                className={`${classes.headertitle} ${classes.title}`}
              >
                <Text translation="documentRevision.clone.modal.title" />
              </Typography>
            </Grid>
            <Grid item>
              <IconButton
                className={classes.closemodel}
                onClick={handleCloneModalClose}
              >
                <ModelCloseIcon />
              </IconButton>
            </Grid>
          </Grid>
          <Box>
            <Typography
              variant="h2"
              component="h2"
              className={`${classes.contenttitle} ${classes.title}`}
            >
              <Text translation="documentRevision.clone.eb.title" />
            </Typography>
            <RadioGroup row value={value} onChange={handleChange} className={classes.radioGroup}>
              <FormControlLabel
                value="false"
                control={
                  <Radio
                    classes={{ root: classes.radio, checked: classes.checked }}
                    checkedIcon={<Active />}
                    icon={<InActive />}
                    disableRipple
                  />
                }
                label={
                  <Typography variant="body2" className={classes.radioLabel}>
                    <Text translation="common.true" />
                  </Typography>
                }
              />
              <FormControlLabel
                value="true"
                control={
                  <Radio
                    classes={{ root: classes.radio, checked: classes.checked }}
                    checkedIcon={<Active />}
                    icon={<InActive />}
                    disableRipple
                  />
                }
                label={
                  <Typography variant="body2" className={classes.radioLabel}>
                    <Text translation="common.false" />
                  </Typography>
                }
              />
            </RadioGroup>
            {!isInternalTypeNumbering && documentType.documentTypeAcronym && <DocIdInputNew
              documentTypeId={documentType.id}
              documentAcronym={documentType.documentTypeAcronym}
              isDisabled={false}
              docId=""
              isShownOnDialog={true}
              handleDocIdUpdated={handleDocIdUpdated}
              helpText={translate('document.revision.user.numbering.help.doc.id.visible.false')}
            />}
          </Box>
          <Box className={classes.footer}>
            <Button
              variant="contained"
              onClick={handleCloneModalClose}
              className={`${classes.buttonCancel} ${classes.buttonLabel}`}
              disableFocusRipple
              disableRipple
            >
              <Text translation="common.cancel" />
            </Button>
            <Button
              variant="contained"
              onClick={cloneAction}
              data-cy="CloneContinue"
              className={`${classes.buttonContinue} ${classes.buttonLabel}`}
            >
              <Text translation="common.continue" />
            </Button>
          </Box>
        </Box>
      </Formik>
    </FormContext.Provider>
  );
};
export default CloneModal;
