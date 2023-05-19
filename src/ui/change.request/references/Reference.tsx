import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { getFormattedDateString, MomentFormats } from '../../../common/utils/date';
import { ChangeRequest } from '../../../state/ducks/changeRequest/types';
import { FBDocumentRevisionProps } from '../../../state/ducks/documentRevisions/types';
import Text from '../../components/Text';
import DocumentRevisionOutputInfo from '../../documentRevision/formBuilder/DocumentRevisionOutputInfo';
import { styles } from '../../documentRevision/References/References.styles';
import UserAvatarListItem from '../../documentRevision/Sidebar/common/UserAvatarListItem';

interface OwnProps {
  chosenForm?: FBDocumentRevisionProps | undefined;
  changeRequest?: ChangeRequest | undefined;
}

const CRReferences: React.FunctionComponent<OwnProps> = ({
  changeRequest,
  chosenForm,
}) => {
  const classes = styles();
  return (
    <Box padding={1.875} width={1} data-cy="generalInfo">
      <Typography className={classes.generalInfo}>
        <Text translation="common.general.info" />
      </Typography>
      {changeRequest?.owner && <UserAvatarListItem
        name={changeRequest.owner.user.name}
        user={changeRequest?.owner && changeRequest.owner.user}
        secondaryComponent={<Text translation="common.owner" />}
      />}
      <>
        <Typography component="span" className={classes.releaseDate}>
          <Text translation="common.created.on" />
        </Typography>
        <Typography className={classes.released}>
          {getFormattedDateString(changeRequest?.createdAt, MomentFormats.MonthDateYearTwoDigit)}
        </Typography>
      </>
      <Box pt={2.5}>
        <DocumentRevisionOutputInfo formDocument={chosenForm || changeRequest?.formDocument} />
      </Box>
    </Box>
  );
};

export default CRReferences;
