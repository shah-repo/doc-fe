import {
  Box, FormControlLabel, Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { ReactComponent as Active } from '../../../../../assets/images/radioActive.svg';
import { ReactComponent as InActive } from '../../../../../assets/images/radioInActive.svg';
import Text from '../../../../components/Text';
import { styles } from './ExportToEmailModal.styles';

interface ExportToEmailModalProps {
  value: boolean
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const ExportToEmailModal: React.FunctionComponent<ExportToEmailModalProps> = ({
  value,
  handleChange,
}) => {
  const classes = styles();

  return (
    <Box
      className={classes.paper}
    >
      <Typography
        variant="h2"
        component="h2"
        className={classes.contenttitle}
      >
        <Text translation="common.send.to.email.prompt" />
      </Typography>
      <RadioGroup value={value} onChange={handleChange}>
        <FormControlLabel
          value={true}
          control={
            <Radio
              classes={{ root: classes.radio }}
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
          value={false}
          control={
            <Radio
              classes={{ root: classes.radio }}
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
    </Box>
  );
};
export default ExportToEmailModal;
