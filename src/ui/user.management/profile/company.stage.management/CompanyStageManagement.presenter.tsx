import { Box, Button, createStyles, InputLabel, makeStyles, RadioGroup } from '@material-ui/core';
import { Field, useFormikContext } from 'formik';
import React from 'react';
import { translate } from '../../../../common/intl';
import { AsyncState } from '../../../../state/types';
import RadioButton from '../../../components/forms/fields/RadioButton';
import FormProgress from '../../../components/forms/FormProgress';
import FormWrapper from '../../../components/forms/FormWrapper';
import Text from '../../../components/Text';
import Colors from '../../../layout/theme/utils/colors';

interface Props {
  asyncState: AsyncState
  disabled: boolean
}

const useStyles = makeStyles(theme => createStyles({
  label: {
    margin: theme.spacing(3, 0, 3, 0),
    fontWeight: 'bold',
    color: Colors.dark_gray,
  },
}));

const CompanyStageManagementPresenter: React.FC<Props> = ({
  asyncState,
  disabled,
}) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const formik = useFormikContext();
  const classes = useStyles();

  return (
    <FormWrapper
      {...formik }
    >
      <Field name="numOfRevStages">
        {({
          field,
        }) => (
          <>
            <InputLabel className={classes.label}>
              {translate('administration.general.settings.revision.stages.number')}
            </InputLabel>
            <RadioGroup {...field}>
              <RadioButton
                label="2"
                value="2"
                disabled={disabled}
              />
              <RadioButton
                label="3"
                value="3"
                disabled={disabled}
              />
            </RadioGroup>
          </>
        )}
      </Field>
      <Field name="startRevisionNumber">
        {({
          field,
        }) => (
          <>
            <InputLabel className={classes.label}>
              {translate('administration.general.settings.revision.start.number')}
            </InputLabel>
            <RadioGroup {...field}>
              <RadioButton
                label="0"
                value="0"
              />
              <RadioButton
                label="1"
                value="1"
              />
            </RadioGroup>
          </>
        )}
      </Field>
      <Box display="flex" justifyContent="flex-end">
        <FormProgress asyncState={asyncState} />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Button
          type="submit"
          data-cy="num-of-rev-stages-save"
          disabled={disabled}
          variant="outlined"
        >
          <Text translation="common.save" />
        </Button>
      </Box>
    </FormWrapper>
  );
};

export default CompanyStageManagementPresenter;
