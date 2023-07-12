import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Divider, Grid } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React from 'react';
import { translate } from '../../../common/intl';
import { Button as AddButton } from '../../components/forms/fields-next';
import FBBOMTreeList from './components/treelist';
import useStyles from './components/treelist/styles';
import { MODE_FIELD } from './constants';
import { EditableBOM } from './interface';

const FBBOM: React.FunctionComponent = () => {
  const classes = useStyles();

  const formik = useFormik<Partial<EditableBOM>>({
    initialValues: {},
    onSubmit: (values) => {
      const bomToSave = omit(values, [MODE_FIELD]);
      console.log('bomToSave ::', bomToSave);
    },
  });

  return (
    <>
      <Grid container alignItems="center" justify="space-between" style={{ padding: 0 }}>
        <Grid item className={classes.header}>
          {translate('tabId.bom')}
        </Grid>
        <Grid item>
          <Button
            disableRipple
            className={classes.addItem}
            startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
          >
            {translate('bom.header.add.item')}
          </Button>
        </Grid>
      </Grid>
      <Divider />
      <Grid item className={classes.tableContainer}>
        <FormikProvider value={formik}>
          <FBBOMTreeList />
        </FormikProvider>
      </Grid>
      <Grid item>
        <AddButton
          fullWidth
          attached
          kind="add"
          className={classes.bottomAddButtom}
          data-cy="fb-control-btn"
        >
          {translate('form.builder.add.line.item')}
        </AddButton>
      </Grid>
    </>);
};

export default FBBOM;
