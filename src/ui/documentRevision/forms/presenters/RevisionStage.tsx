import { Box, Typography } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import { companySelectors } from '../../../../state/ducks/company';
import { RevisionStageOptions } from '../../../../state/ducks/documentRevisions/types';
import RadioButton from '../../../components/forms/fields/RadioButton';
import RadioGroup from '../../../components/forms/fields/RadioGroup';
import { required, validator } from '../../../components/forms/fields/validators';
import Text from '../../../components/Text';
import { useRevisionStageSelect } from '../../../hooks/docCustomization/useCustomization';
import { styles } from './styles/RevisionStage.styles';

interface Props {
  isDisabled: boolean;
  isDocRevFirstDraft: boolean;
  shouldShowRevStageForDocType: boolean;
  documentTypeId: string;
  defaultRevisionStage: string;
}

const RevisionStage: React.FunctionComponent<Props> = ({
  isDisabled,
  isDocRevFirstDraft,
  shouldShowRevStageForDocType,
  documentTypeId,
  defaultRevisionStage,
}) => {
  const { isVisible } = useRevisionStageSelect(documentTypeId);
  const classes = styles();
  const numOfRevStages = useSelector(companySelectors.getCompanyMaxRevisionStage);
  const revStageOptions = numOfRevStages === 2 ?
    RevisionStageOptions.filter((stage) => stage.value !== 2) :
    RevisionStageOptions;

  if ((isDisabled && (!isDocRevFirstDraft || !shouldShowRevStageForDocType)) || (!isVisible && defaultRevisionStage)) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h6" className={classes.title}>
        <Text message={'document.revision.stage'}/>
      </Typography>
      <RadioGroup name="revisionStage" validate={validator(required)}>
        {revStageOptions.map((option) =>
          <RadioButton
            key={`${option.value}-${option.text}`}
            className={classes.radioButton}
            label={<Text message={option.text} />}
            // had to covert to string
            // if value is number, cheking radio buttons doesn't work correctly
            value={option.value.toString()}
            data-cy={option.text}
            style={{ width: 'fit-content', marginLeft: 0 }}
          />)
        }
      </RadioGroup>
    </Box>
  );
};

export default React.memo(RevisionStage);
