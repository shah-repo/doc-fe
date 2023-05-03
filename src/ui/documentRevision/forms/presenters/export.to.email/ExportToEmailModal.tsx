import {
  Box,
  Button,
  FormControlLabel, Grid, IconButton, Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import React from 'react';
import { ReactComponent as ModelCloseIcon } from '../../../../../assets/images/modelClose.svg';
import { ReactComponent as Active } from '../../../../../assets/images/radioActive.svg';
import { ReactComponent as InActive } from '../../../../../assets/images/radioInActive.svg';
import Text from '../../../../components/Text';
import { styles } from './ExportToEmailModal.styles';

interface ExportToEmailModalProps {
  handleCloneModelClose: () => void
  action: (payload) => void
}

const ExportToEmailModal: React.FunctionComponent<ExportToEmailModalProps> = ({
  handleCloneModelClose,
  action,
}) => {
  const classes = styles();
  const [value, setValue] = React.useState('false');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
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
            <Text translation="common.send.to.email" />
          </Typography>
        </Grid>
        <Grid item>
          <IconButton
            className={classes.closemodel}
            onClick={handleCloneModelClose}
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
          <Text translation="common.send.to.email.prompt" />
        </Typography>
        <RadioGroup value={value} onChange={handleChange}>
          <FormControlLabel
            value="true"
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
            value="false"
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
      <Box className={classes.footer}>
        <Button
          variant="contained"
          onClick={handleCloneModelClose}
          className={`${classes.buttonCancel} ${classes.buttonLabel}`}
          disableFocusRipple
          disableRipple
        >
          <Text translation="common.cancel" />
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            action({ includeAuditLogs: value });
          }}
          data-cy="CloneContinue"
          className={`${classes.buttonContinue} ${classes.buttonLabel}`}
        >
          <Text translation="common.continue" />
        </Button>
      </Box>
    </Box>
  );
};
export default ExportToEmailModal;
