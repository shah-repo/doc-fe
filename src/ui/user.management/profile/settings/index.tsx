import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
} from '@material-ui/core';
import { Field, FieldProps, Form, Formik } from 'formik';
import React from 'react';
import { translate } from '../../../../common/intl';
import { BOMSettings } from './interface';
import { styles } from './styles';
interface SettingProps {
  closeUserProfile: () => void
  showUserProfile: boolean
}

const UserSettingsContainer: React.FC<SettingProps> = ({
  showUserProfile,
  closeUserProfile,
}) => {
  const classes = styles();

  // update these values once we get from API
  const initialValues: BOMSettings = {
    attributeChanges: false,
    bomLineChanges: true,
    ApprovedSupplierListChanges: false,
    changeAttachments: true,
    changeReferences: false,
  };

  // Fire API to update values
  const onSubmit = (values: BOMSettings) => {
    console.log('On submit', values);
  };
  return (
    <Dialog classes={{ paper: classes.dialogPaper }} open={showUserProfile}>
      <DialogTitle id="user-settings-dialog-title">
        <h3>{translate('header.menu.my.settings')}</h3>
      </DialogTitle>
      <DialogContent>
        <Grid container>
          <Divider />
          <Grid item>
            <h4>{translate('settings.bom')}</h4>
          </Grid>
          <Grid item>
            <Formik
              initialValues={initialValues}
              onSubmit={onSubmit}
              enableReinitialize={true}
            >
              <Form>
                <Field name="attributeChanges">
                  {({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch {...field} checked={field.value} color="primary" />
                      }
                      label={translate('settings.bom.attribute.changes')}
                    />
                  )}
                </Field>
                <br />
                <Field name="bomLineChanges">
                  {({ field }: FieldProps<boolean>) => (
                    <FormControlLabel
                      control={
                        <Switch {...field} checked={field.value} color="primary" />
                      }
                      label={translate('settings.bom.line.changes')}
                    />
                  )}
                </Field>
                <br />
                <Field name="ApprovedSupplierListChanges">
                  {({ field }: FieldProps<boolean>) => (
                    <FormControlLabel
                      control={
                        <Switch {...field} checked={field.value} color="primary" />
                      }
                      label={translate(
                        'settings.bom.approved.supplier.list.changes',
                      )}
                    />
                  )}
                </Field>
                <br />
                <Field name="changeAttachments">
                  {({ field }: FieldProps<boolean>) => (
                    <FormControlLabel
                      control={
                        <Switch {...field} checked={field.value} color="primary" />
                      }
                      label={translate('settings.bom.change.attachment.changes')}
                    />
                  )}
                </Field>
                <br />
                <Field name="changeReferences">
                  {({ field }: FieldProps<boolean>) => (
                    <FormControlLabel
                      control={
                        <Switch {...field} checked={field.value} color="primary" />
                      }
                      label={translate('settings.bom.change.references')}
                    />
                  )}
                </Field>
                <br />
                <Grid container alignItems="center" justify="flex-end">
                  <Button autoFocus onClick={closeUserProfile} color="secondary">
                    {translate('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    autoFocus
                    onClick={closeUserProfile}
                    color="primary"
                  >
                    {translate('common.save')}
                  </Button>
                </Grid>
              </Form>
            </Formik>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default UserSettingsContainer;
