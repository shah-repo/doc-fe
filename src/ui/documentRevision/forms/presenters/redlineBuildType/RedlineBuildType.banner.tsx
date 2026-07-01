import { Box } from '@material-ui/core';
// import { isUndefined } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { LHRBuild } from '../../../../administration/general.settings/panels/LHRBuild/types';
import Text from '../../../../components/Text';
import { FB, FBAutocompleteAsyncOption } from '../../../../form.builder';
import FBAutocompleteAsyncStore from '../../../../form.builder/FBAutocompleteAsync/FBAutocompleteAsync.store';
import useStyles from './RedlineBuildType.banner.styles';

interface Props {
  documentRevision?: DocumentRevision
}

const RedlineBuildTypeBanner: React.FunctionComponent<Props> = ({
  documentRevision,
}) => {
  const classes = useStyles();
  const { formState, workspaceState } = FB.useStores();
  const buildTypes = FBAutocompleteAsyncStore.data.get(FBAutocompleteAsyncOption.buildType);
  const options = buildTypes ? Array.from(buildTypes?.values() as LHRBuild[]) : workspaceState?.buildTypeOptions;

  const buildTypeSource = documentRevision ? documentRevision.formInput
    : { 'lhr-build-type': formState?.getFieldValue('lhr-build-type'), 'new-lhr-build-type': formState?.getFieldValue('new-lhr-build-type') };

  const oldBuildType = options?.find(({ id }) => id === buildTypeSource?.['lhr-build-type']);
  const newBuildType = options?.find(({ id }) => id === buildTypeSource?.['new-lhr-build-type']);

  const message = translate('form.builder.redline.build.type.switch.pending', {
    oldBuildType: oldBuildType?.displayLabel || 'N/A',
    newBuildType: newBuildType?.displayLabel || 'N/A',
  });

  if (oldBuildType) {
    return (
      <Box className={classes.root}>
        <Text message={message} />
      </Box>
    );
  } else {
    return null;
  }
};

export default observer(RedlineBuildTypeBanner);
