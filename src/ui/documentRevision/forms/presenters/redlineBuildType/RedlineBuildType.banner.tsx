import { Box } from '@material-ui/core';
// import { isUndefined } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { DocumentRevision } from '../../../../../state/ducks/documentRevisions/types';
import { store } from '../../../../../state/store';
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
  const loggedInUser = store.getState().auth.user;
  const isUserHaveAccess = documentRevision?.approvals?.some(approval => approval.approver.user.id === loggedInUser.id);
  let oldBuildType = options?.find(option => option.id === formState?.getFieldValue('lhr-build-type'));
  let newBuildType = options?.find(option => option.id === formState?.getFieldValue('new-lhr-build-type'));

  if(documentRevision && isUserHaveAccess) {
    oldBuildType = options?.find(option => option.id === documentRevision?.formInput?.['lhr-build-type']);
    newBuildType = options?.find(option => option.id === documentRevision?.formInput?.['new-lhr-build-type']);
  }

  const message = translate('form.builder.redline.build.type.switch.pending', {
    oldBuildType: oldBuildType?.displayLabel || 'N/A',
    newBuildType: newBuildType?.displayLabel || 'N/A',
  });

  if(oldBuildType) {
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
