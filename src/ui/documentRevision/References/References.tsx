import { Box, FormControlLabel, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DocumentRevisionFooterNew, SMText } from '../../../App';
import { getFormattedDateString, MomentFormats } from '../../../common/utils/date';
import { authSelectors } from '../../../state/ducks/auth';
import { DocumentRevision } from '../../../state/ducks/documentRevisions/types';
import { Checkbox } from '../../components/forms/fields-next';
import Text from '../../components/Text';
import ReferencedByContainer from '../../document.revision/summary/referencedBy.container.new';
import ReferenceToContainer from '../../document.revision/summary/referenceTo.container.new';
import { useTraining } from '../../hooks/docCustomization/useCustomization';
import useGetAvailableReferences from '../../hooks/useGetAvailableReferences';
import { isOperator } from '../DocumentRevisionDisplay.container';
import AvailableReferencesField from '../forms/presenters/AvailableReferences.new';
import { toDocumentRevisionFormValues } from '../forms/transform';
import { DocumentRevisionFormValues } from '../forms/types';
import { checkIsDocumentRecord } from '../helpers/checkDocumentGroup';
import { isOwner } from '../helpers/documentRevisionPermissions';
import UserAvatarListItem from '../Sidebar/common/UserAvatarListItem';
import { styles } from './References.styles';
import { ReferencesProps } from './types';

const References = ({
  selectedDocument,
  edit,
}: ReferencesProps) => {
  const classes = styles();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { owner, status, deprecatedAt, referenceTo, releasedAt, retrain, document } = selectedDocument!;
  const initialValues = useMemo(
    () => selectedDocument && toDocumentRevisionFormValues(selectedDocument),
    [selectedDocument],
  );
  const availableReferences = useGetAvailableReferences(initialValues as DocumentRevisionFormValues);
  const isCurrentUserOperator = React.useContext(isOperator);
  const groupOptions = selectedDocument?.document.documentType.groupOptions;
  const email = useSelector(authSelectors.currentUserEmail);
  const isDisabledInput = initialValues && initialValues.id !== undefined
   && isCurrentUserOperator && !isOwner(selectedDocument as DocumentRevision, email) && !selectedDocument?.isBeingEditedAfterRelease;

  const showChangeControlDetails = selectedDocument?.changeControlOptions?.id
    && selectedDocument.isBeingEditedAfterRelease;

  const documentTypeId = selectedDocument?.document?.documentType?.id ?? '';
  const { isVisible } = useTraining(documentTypeId);
  const isRecord = checkIsDocumentRecord(groupOptions);

  return (
    <Box padding={1.875} width={1} data-cy="generalInfo">
      <Typography className={classes.generalInfo}>
        <Text translation="common.general.info" />
      </Typography>
      <UserAvatarListItem
        name={owner.user.name}
        user={owner && owner.user}
        secondaryComponent={<Text translation="common.owner" />}
      />
      {edit && (
        <AvailableReferencesField
          availableReferences={availableReferences}
          documentReferences={referenceTo}
          name="referenceTo"
          label="documentRevision.form.references"
          disabled={isDisabledInput}
          documentGroupOptions={groupOptions}
        />
      )}
      {!edit && referenceTo && (
        <ReferenceToContainer
          canEdit={edit}
          dataProp={referenceTo}
          status={status}
          deprecatedAt={deprecatedAt}
        />
      )}
      {document.referencedBy && (
        <ReferencedByContainer dataProp={document.referencedBy} />
      )}
      {(isVisible && !isRecord) && <FormControlLabel id="checkbox-label" className={classes.checkboxHolder}
        control={
          <Checkbox
            checked={retrain}
            disabled
            data-cy="training-required-checkbox"
            id="training-required-checkbox"
          />
        }
        label={<Text data-cy="training" translation="document.revision.trainingRequired" />}
      />}
      <Box>
        <Typography component="span" className={classes.releaseDate}>
          <Text dataCy="releaseDate" translation="documentRevision.form.release.date" />
        </Typography>
        <Typography className={classes.released}>
          {releasedAt
            ? getFormattedDateString(
              releasedAt,
              MomentFormats.MonthDateYearTwoDigit,
            )
            : <Text translation="common.none" />}
        </Typography>
      </Box>
      <DocumentRevisionFooterNew />
      {
        showChangeControlDetails && <Box
          pt={2.5}
        >
          <Typography className={classes.releaseDate}>
            <SMText label="documentRevision.pmccc.applied.title" />
          </Typography>
          <Typography component="div" className={classes.released}>
            <>{selectedDocument?.changeControlOptions?.docId}</>,&nbsp;
            <Text message="documentRevision.pmccc.applied.revision" /> {selectedDocument?.changeControlOptions?.displayRevision}, &nbsp;
            <>
              {getFormattedDateString(
                      selectedDocument?.changeControlOptions?.releasedAt,
                      MomentFormats.MonthDateYearTwoDigit,
              )}
            </>
          </Typography>
        </Box>
      }
    </Box>
  );
};

export default References;
