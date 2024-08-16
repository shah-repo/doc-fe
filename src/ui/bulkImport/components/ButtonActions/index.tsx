import {
  Box,
} from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import { Button } from '../../../components/forms/fields-next';
import Text from '../../../components/Text';
import { Translation } from '../../../translations/types';
import useStyles from './styles';

interface ButtonActionsProps {
  activeStep: number
  steps: string[]
  nextSubmit?: boolean
  useBack?: boolean
  useReset?: boolean
  nextTranslation?: Translation
  handleNext: () => void
  handleBack: () => void
  handleReset: () => void
}

const ButtonActions: React.FC<ButtonActionsProps> = ({ activeStep, steps, nextSubmit = false, useBack = false, useReset = false, nextTranslation = 'common.next', handleNext, handleBack, handleReset }) => {
  const classes = useStyles();

  return (
    <Box>
      <Box className={useBack ? classes.buttonsContainerMultiBtn : classes.buttonsContainer}>
        {useBack && (<Button kind="outlined" className={classes.buttonsBack} disabled={activeStep === 0} onClick={handleBack}><Text translation="common.previous" /></Button>)}
        <Button
          type={nextSubmit ? 'submit' : 'button'}
          onClick={nextSubmit ? undefined : handleNext}
          className={classes.buttonsNext}
        >
          <Text translation={nextTranslation} />
        </Button>
      </Box>
      {useReset && (<Button onClick={handleReset}>{translate('common.reset')}</Button>)}
    </Box>
  );
};

export default ButtonActions;
