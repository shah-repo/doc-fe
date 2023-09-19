import { Box, FormControlLabel, Radio, Typography } from '@material-ui/core';
import cx from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';
import { documentTypeSelectors } from '../../../../state/ducks/documentRevisions/documentType';
import { DocumentRevision, RevisionChangeType } from '../../../../state/ducks/documentRevisions/types';
import { ApplicationState } from '../../../../state/reducers';
import RadioGroup from '../../../components/forms/fields/RadioGroup';
import { required, validator } from '../../../components/forms/fields/validators';
import Text from '../../../components/Text';
import CustomLabelTooltip from '../../../hooks/docCustomization/CustomLabelTooltip';
import { useAdministrativeChange, useNextRevision, useNextRevisionStage, useObsolete, useRevisionSelect } from '../../../hooks/docCustomization/useCustomization';
import { versionNumber } from '../../helpers/generateRevisionNumber';
import { styles } from './RevisionTypeChange.styles';

interface Props {
  documentTypeId?: string
  isDisabled: boolean
  isDocRevFirstDraft: boolean
  showAdministrativeAndVoidChange: boolean
  isRecord?: boolean
  isPORecord?: boolean
  releasedDocRev?: DocumentRevision
  isAlphaReleased: boolean
}
const RevisionTypeChange: React.FunctionComponent<Props> = ({
  documentTypeId = '',
  isDisabled,
  isDocRevFirstDraft,
  showAdministrativeAndVoidChange,
  isRecord,
  isPORecord,
  releasedDocRev,
  isAlphaReleased,
}) => {
  const classes = styles();
  const {
    isVisible: showRevisionSelect,
    label: revisionSelectLabel,
    tooltipConfig: revisionTooltipConfig,
  } = useRevisionSelect(documentTypeId);
  const {
    isVisible: showNextRevisionLevel,
    label: nextRevisionLevelLabel,
    tooltipConfig: revisionLevelTooltipConfig,
  } = useNextRevision(documentTypeId);
  const {
    isVisible: showNextRevisionStage,
    label: nextRevisionStageLabel,
    tooltipConfig: revisionStageTooltipConfig,
  } = useNextRevisionStage(documentTypeId);
  const {
    isVisible: showObsolete,
    label: obsoleteLabel,
    tooltipConfig: obsoleteTooltipConfig,
  } = useObsolete(documentTypeId);
  const {
    isVisible: showAdministrationChange,
    label: administrationChangeLabel,
    tooltipConfig: administrationTooltipConfig,
  } = useAdministrativeChange(documentTypeId);
  const numOfStages = useSelector<ApplicationState, number>(
    state => documentTypeSelectors.getDocTypeNumOfRevStages(state, documentTypeId),
  );

  if (!showRevisionSelect) {
    return null;
  }

  const generateVersionPrediction = (revisionChangeType: RevisionChangeType) =>
    versionNumber(revisionChangeType, numOfStages, releasedDocRev, isRecord);

  return (
    <Box mt={3}>
      <CustomLabelTooltip tooltipConfig={revisionTooltipConfig}>
        <Typography variant="h6" className={classes.labelTitle}>
          <Text
            message={revisionSelectLabel}
          />
        </Typography>
      </CustomLabelTooltip>
      <RadioGroup name="revisionChangeType" validate={validator(required)}>
        <Box>
          {
            showNextRevisionLevel && !showAdministrativeAndVoidChange
            && <CustomLabelTooltip tooltipConfig={revisionLevelTooltipConfig}>
              <>
                <FormControlLabel
                  value={RevisionChangeType.NextRevision}
                  control={<Radio color="primary" disableRipple />}
                  label={<Typography variant="body1"
                    className={cx(classes.labelSubTitle, {
                      [classes.isDisabled]: isDisabled,
                    })}>
                    <Text message={nextRevisionLevelLabel} />
                  </Typography>}
                  id="RevisionTypeChange-nextRevision"
                  disabled={isDisabled}
                  className={classes.label}
                />
                <Typography variant="body1" display="inline"
                  className={cx(classes.labelSubTitle, {
                    [classes.isDisabled]: isDisabled,
                  })}>
                  {generateVersionPrediction(RevisionChangeType.NextRevision)}
                </Typography>
              </>
            </CustomLabelTooltip>
          }
        </Box>
        <Box>
          {
            showNextRevisionStage && !showAdministrativeAndVoidChange && !isAlphaReleased
            && <CustomLabelTooltip tooltipConfig={revisionStageTooltipConfig}>
              <>
                <FormControlLabel
                  control={<Radio color="primary" disableRipple />}
                  label={<Typography variant="body1"
                    className={cx(classes.labelSubTitle, {
                      [classes.isDisabled]: isDisabled,
                    })}>
                    <Text message={nextRevisionStageLabel} />
                  </Typography>}
                  data-cy="upgradeNextRevisionStage"
                  value={RevisionChangeType.NextRevisionStage}
                  id="RevisionTypeChange-nextRevisionStage"
                  disabled={isDisabled}
                  className={classes.label}
                />
                <Typography variant="body1" display="inline"
                  className={cx(classes.labelSubTitle, {
                    [classes.isDisabled]: isDisabled,
                  })}>
                  {generateVersionPrediction(RevisionChangeType.NextRevisionStage)}
                </Typography>
              </>
            </CustomLabelTooltip>
          }
        </Box>
        <Box>
          {
            showObsolete && !isDocRevFirstDraft && !isPORecord
            && <CustomLabelTooltip tooltipConfig={obsoleteTooltipConfig }>
              <>
                <FormControlLabel
                  control={<Radio color="primary" disableRipple />}
                  label={
                    <Typography variant="body1"
                      className={cx(classes.labelSubTitle, {
                        [classes.isDisabled]: isDisabled,
                      })}>
                      <Text message={ showAdministrativeAndVoidChange ? 'common.void' : obsoleteLabel} />
                    </Typography>}
                  value={RevisionChangeType.Obsolete}
                  id="RevisionTypeChange-obsolete"
                  disabled={isDisabled}
                  className={classes.label}
                />
                {generateVersionPrediction(RevisionChangeType.Obsolete)}
              </>
            </CustomLabelTooltip>
          }
        </Box>
        <Box>
          {
            showAdministrationChange && !isPORecord && !isDocRevFirstDraft
            && <CustomLabelTooltip tooltipConfig={administrationTooltipConfig}>
              <>
                <FormControlLabel
                  control={<Radio color="primary" disableRipple />}
                  label={
                    <Typography variant="body1"
                      className={cx(classes.labelSubTitle, {
                        [classes.isDisabled]: isDisabled,
                      })}>
                      <Text message={administrationChangeLabel} />
                    </Typography>}
                  value={RevisionChangeType.AdministrativeChange}
                  id="RevisionTypeChange-administrativeChange"
                  data-cy="RevisionTypeChange-administrativeChange"
                  disabled={isDisabled}
                  className={classes.label}
                />
                {generateVersionPrediction(RevisionChangeType.AdministrativeChange)}
              </>
            </CustomLabelTooltip>
          }
        </Box>
      </RadioGroup>
    </Box>
  );
};
export default React.memo(RevisionTypeChange);
