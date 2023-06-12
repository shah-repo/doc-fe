import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import cx from 'classnames';
import { Form } from 'formik';
import { isEmpty } from 'lodash';
import React, { Fragment } from 'react';
import { ReactComponent as MigrationIcon } from '../../../../../../src/assets/images/migration.svg';
import { DocumentTypeByIdForm } from '../../../../../state/ducks/documentRevisions/documentType/types';
import { AsyncState, AsyncStatus } from '../../../../../state/types';
import CircularFormProgress from '../../../../components/forms/CircularFormProgress';
import AutocompleteField from '../../../../components/forms/fields/Autocomplete/Autocomplete';
import Text from '../../../../components/Text';
import { FBButton, FBSchemaProps } from '../../../../form.builder';
import useStyles from './ChangeDocumentForm.styles';
import { determineLabel, toFieldsOptions, toFormOptions } from './utils/transform';

interface Props {
  availableForms: DocumentTypeByIdForm[];
  handleFormChange: (value) => void;
  availableFields: FBSchemaProps[];
  sourceSchema: FBSchemaProps[];
  updateFormAsyncState: AsyncState;
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

function renderFields(availableFields: FBSchemaProps[], sourceSchema: FBSchemaProps[]) {
  return availableFields.map((field) => {
    // Hack: added default value for paragraph because it doesn't have a label
    const label = determineLabel(field);
    return <Fragment key={field.name}>
      <AutocompleteField
        name={String(field.name)}
        label={String(label)}
        autocompleteProps={{
          id: 'formMigrationField',
          isClearable: true,
        }}
        options={toFieldsOptions(field, sourceSchema)} />
    </Fragment>;
  });
}

const ChangeDocumentFormPresenter: React.FunctionComponent<Props> = ({
  availableForms,
  handleFormChange,
  availableFields,
  sourceSchema,
  updateFormAsyncState,
  isDialogOpen,
  openDialog,
  closeDialog,
}) => {
  const classes = useStyles();

  return (
    <>
      <FBButton
        fullWidth
        style={{ margin: 0 }}
        variant="contained"
        label="common.form.migration"
        startIcon={<MigrationIcon />}
        onClick={openDialog}
      />
      <Dialog open={isDialogOpen} scroll="body" fullWidth maxWidth="sm" classes={{
        paper: classes.paper,
      }}>
        <Form>
          <DialogTitle disableTypography classes={{
            root: classes.titleRoot,
          }}>
            <Typography variant="h6"><Text translation="common.form.migration" /></Typography>
            <IconButton style={{ padding: 0 }} size="small" onClick={closeDialog}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent classes={{
            root: cx(classes.contentRoot, { [classes.formContent]: !isEmpty(availableFields) }),
          }} dividers>
            <Box>
              <AutocompleteField
                name="changeDocumentForm"
                size="sm"
                label="common.select.migration.form"
                autocompleteProps={{
                  id: 'changeDocumentForm',
                }}
                options={toFormOptions(availableForms)}
                onChange={handleFormChange}
              />
            </Box>
          </DialogContent>
          {!isEmpty(availableFields) && (
            <DialogContent classes={{
              root: cx(classes.contentRoot, classes.fieldsContent),
            }} dividers>
              {renderFields(availableFields, sourceSchema)}
              {updateFormAsyncState.status !== AsyncStatus.Idle && (
                <Box display="flex" justifyContent="center" m={3}>
                  <CircularFormProgress asyncState={updateFormAsyncState} />
                </Box>
              )}
            </DialogContent>
          )}
          <DialogActions classes={{ root: classes.actionsRoot }}>
            <FBButton
              onClick={closeDialog}
              variant="outlined"
              color="primary"
              data-cy="cancelButton"
              label="common.cancel"
            />
            <FBButton
              type="submit"
              variant="contained"
              color="primary"
              data-cy="confirmButton"
              label="common.confirm.change"
            />
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
};

export default ChangeDocumentFormPresenter;
