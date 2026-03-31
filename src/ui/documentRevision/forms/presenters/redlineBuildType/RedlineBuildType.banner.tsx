import { Box } from '@material-ui/core';
import { observer } from 'mobx-react';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { LHRBuild } from '../../../../administration/general.settings/panels/LHRBuild/types';
import Text from '../../../../components/Text';
import { FB, FBAutocompleteAsyncOption } from '../../../../form.builder';
import FBAutocompleteAsyncStore from '../../../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store';
import useStyles from './RedlineBuildType.banner.styles';

const RedlineBuildTypeBanner: React.FunctionComponent = () => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();
  const buildTypes = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.buildType);
  const options = buildTypes ? Array.from(buildTypes?.values() as LHRBuild[]) : workspaceState?.buildTypeOptions;
  const oldBuildType = options?.find(option => option.id === formState?.getFieldValue('lhr-build-type'));
  const newBuildType = options?.find(option => option.id === formState?.getFieldValue('new-lhr-build-type'));

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

export default observer(RedlineBuildTypeBanner);
