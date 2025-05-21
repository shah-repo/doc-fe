import { Box, Card, CardContent, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@material-ui/core';
import Markdown from 'markdown-to-jsx';
import React, { useState } from 'react';
import { translate } from '../../../common/intl';
import Text from '../../components/Text';
import { FBSchemaState } from '../../form.builder';
import { FBOption } from '../../form.builder/index';
import { FBInputProps } from '../../form.builder/types/common';
import { Translation } from '../../translations/types';
import { AnnouncementRowDetail, ConflictItem, FormComponent, SelectedResolution } from './interface';
import useStyles from './styles';

interface AnnouncementDetailProps {
  announcementDetailRow: AnnouncementRowDetail
  conflictingElements: Record<string, ConflictItem>
  handleConflictResolution: (row: AnnouncementRowDetail, value: SelectedResolution) => void
}

const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({
  announcementDetailRow,
  conflictingElements,
  handleConflictResolution,
}) => {
  const classes = useStyles();
  const { formBuilder } = announcementDetailRow;
  const [selectedOption, setSelectedOption] = useState<string>('');

  const componentToRender = (controlProps: FBInputProps): React.ReactNode | undefined => {
    const { type, name, index } = controlProps;
    const schemaControl = FBSchemaState.control[type || ''];
    if (!schemaControl) return;

    return React.createElement(schemaControl, {
      key: `fb-control-${type}-${name}-${index}`,
      ...controlProps,
    });
  };

  const getFormComponentDetails = (formBuilder: FormComponent): Partial<FBInputProps> => ({
    name: formBuilder.keyName,
    label: formBuilder.defaultLabel,
    type: formBuilder.type,
    ...(formBuilder.optionId !== '-1' && { optionId: formBuilder.optionId }),
    ...(formBuilder.options?.length && { options: formBuilder.options }),
  });

  const handleOptionSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as SelectedResolution;
    setSelectedOption(value);
    handleConflictResolution(announcementDetailRow, value);
  };

  const getTabText = (defaultTabId: string): Translation => `tabId.${defaultTabId}` as Translation;
  const conflictData = conflictingElements[announcementDetailRow.id];
  const hasConflict = !!(formBuilder && conflictData?.options?.length && conflictData?.mustBeResolved);

  return (
    <Grid item lg={12} xl={6}>
      <Card className={classes.announcementDetailRoot}>
        {formBuilder && (
          <>
            <CardContent className={classes.announcementDetailCardHeader}>
              <Typography variant="h5">
                <u>{formBuilder.defaultLabel}</u>
              </Typography>
              <Typography className={classes.announcementDetailTabIndicatorText}>
                {translate('supplier.announcement.detail.tab.indicator.start.message')}{' '}
                <b>
                  <Text translation={getTabText(formBuilder.defaultTabId)} />
                </b>{' '}
                {translate('supplier.announcement.detail.tab.indicator.end.message')}
              </Typography>
            </CardContent>
            {announcementDetailRow.helpText && (
              <CardContent className={classes.announcementDetailTextDescription}>
                <Markdown>{announcementDetailRow.helpText}</Markdown>
              </CardContent>
            )}
            <Box className={classes.componentDisplayBox}>{componentToRender(getFormComponentDetails(formBuilder))}</Box>
            {formBuilder.describingText && (
              <CardContent className={classes.announcementDetailTextDescription}>
                <Markdown>{formBuilder.describingText}</Markdown>
              </CardContent>
            )}
          </>
        )}
        {!formBuilder && announcementDetailRow.helpText && (
          <CardContent className={classes.announcementDetailTextDescription}>
            <Markdown>{announcementDetailRow.helpText}</Markdown>
          </CardContent>
        )}
        {hasConflict && (
          <RadioGroup name="selectedResolution" value={selectedOption} onChange={handleOptionSelect}>
            <Grid container className={classes.conflictingElementsContainer}>
              <Grid item xs={6} className={classes.announcementDetailOptionsArea}>
                <FormControlLabel
                  value={SelectedResolution.EXISTING}
                  control={<Radio />}
                  label={translate('supplier.announcement.detail.existing.options')}
                  className={classes.announcementDetailOptionsHeading}
                />
                <Typography className={classes.announcementDetailOptionsText}>
                  {(conflictData.options as FBOption[])?.map((option) => option.text).join(', ')}
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.announcementDetailOptionsArea}>
                <FormControlLabel
                  value={SelectedResolution.NEW}
                  control={<Radio />}
                  label={translate('supplier.announcement.detail.new.options')}
                  className={classes.announcementDetailOptionsHeading}
                />
                <Typography className={classes.announcementDetailOptionsText}>
                  {formBuilder.options?.map((option) => option.text).join(', ')}
                </Typography>
              </Grid>
              <Typography variant="body2">{translate('supplier.announcement.detail.tab.helper.message')}</Typography>
            </Grid>
          </RadioGroup>
        )}
      </Card>
    </Grid>
  );
};

export default AnnouncementDetail;
