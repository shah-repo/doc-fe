import { FormHelperText, makeStyles } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import Colors from '../../../layout/theme/utils/colors';

const styles = makeStyles((theme) => ({
  error: {
    color: Colors.latest_red_varient,
  },
}));

interface Props {
  label: string
}

const ErrorBlock: React.FC<Props> = ({ label }) => {
  const classes = styles();

  return (
    <FormHelperText className={classes.error}>
      {translate('common.field.required', { label })}
    </FormHelperText>
  );
};

export default ErrorBlock;
