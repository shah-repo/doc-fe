import {
  Button,
  Dialog,
  DialogContent, Divider,
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
      <DialogContent>
        <Grid container>
          <Grid item xs={12} >
            <h4 className={classes.header}>{translate('header.menu.my.settings')}:</h4>
          </Grid>
          <Divider />
          <Grid item className={classes.subheader}>
            <span className={classes.header}>{translate('settings.bom')}</span>
          </Grid>
          <Grid item xs={12}>
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
                      className={classes.field}
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
                      className={classes.field}
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
                      className={classes.field}
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
                      className={classes.field}
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
                      className={classes.field}
                    />
                  )}
                </Field>
                <br />
                <Grid container xs={12} alignItems="center" justify="flex-end">
                  <Grid item>
                    <Button
                      disableRipple
                      variant="contained"
                      onClick={closeUserProfile}
                    >
                      {translate('common.cancel')}
                    </Button>
                    <Button
                      disableRipple
                      type="submit"
                      variant="contained"
                      color="secondary"
                      onClick={closeUserProfile}
                    >
                      {translate('common.save')}
                    </Button>
                  </Grid>
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
