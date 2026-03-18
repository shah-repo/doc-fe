import { Box } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../common/intl';
import Text from '../../../../components/Text';
import { FB } from '../../../../form.builder';
import useStyles from './RedlineBuildType.banner.styles';

const RedlineBuildTypeBanner: React.FunctionComponent = () => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();
  const oldBuildType = workspaceState?.buildTypeOptions.find(option => option.id === formState?.getFieldValue('lhr-build-type'));
  const newBuildType = workspaceState?.buildTypeOptions.find(option => option.id === formState?.getFieldValue('new-lhr-build-type'));

  const message = translate('form.builder.redline.build.type.switch.pending', {
    oldBuildType: oldBuildType?.displayLabel || 'N/A',
    newBuildType: newBuildType?.displayLabel || 'N/A',
  });

  return (
    <Box className={classes.root}>
      <Text message={message} />
    </Box>
  );
};

export default RedlineBuildTypeBanner;
