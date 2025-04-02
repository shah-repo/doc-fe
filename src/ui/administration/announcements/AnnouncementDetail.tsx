import { Box, Card, CardContent, FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@material-ui/core';
import Markdown from 'markdown-to-jsx';
import React, { useState } from 'react';
import { FBOption } from '../../../../src/ui/form.builder/index';
import Text from '../../components/Text';
import { FBSchemaState } from '../../form.builder';
import { FBInputProps } from '../../form.builder/types/common';
import { Translation } from '../../translations/types';
import { IAnnouncementDetail, IConflictingItem, IFormBuilder, SELECTED_RESOLUTION_ENUM } from './interface';
import useStyles from './styles';

const AnnouncementDetail: React.FC<{
  announcementDetailRow: IAnnouncementDetail
  conflictingElementsMap: { [key: string]: IConflictingItem }
  handleConflictResolution: (announcementDetailRow: IAnnouncementDetail, value: SELECTED_RESOLUTION_ENUM) => void
}> = ({ announcementDetailRow, conflictingElementsMap, handleConflictResolution }) => {
  const classes = useStyles();

  const { formBuilder } = announcementDetailRow;
  const [selectedOption, setSelectedOption] = useState<string>('');

  function componentToRender (controlProps: FBInputProps): React.ReactNode | undefined {
    const { type, name, index } = controlProps;
    const schemaControl = FBSchemaState.control[type || ''];
    if (!schemaControl) {
      return;
    }
    return React.createElement(schemaControl, {
      key: `fb-control-${type}-${name}-${index}`,
      ...controlProps,
    });
  }

  function getFormComponentDetails (formBuilder: IFormBuilder) {
    const details: Partial<FBInputProps> = {
      name: formBuilder.keyName,
      label: formBuilder.defaultLabel,
      type: formBuilder.type,
    };

    if (formBuilder.optionId !== '-1') {
      details.optionId = formBuilder.optionId;
    }

    if (formBuilder.options?.length) {
      details.options = formBuilder.options;
    }

    return details;
  }

  function optionSelected (event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value as SELECTED_RESOLUTION_ENUM;
    setSelectedOption(value);
    handleConflictResolution(announcementDetailRow, value);
  }

  function getTabText (defaultTabId: string) {
    return `tabId.${defaultTabId}` as Translation;
  }

  return (
    <Grid item lg={12} xl={6}>
      <Card className={classes.announcementDetailRoot}>
        {formBuilder && <>
          <CardContent className={classes.announcementDetailCardHeader}>
            <Typography variant="h5">
              <u>{formBuilder.defaultLabel}</u>
            </Typography>
            <Typography className={classes.announcementDetailTabIndicatorText}>
              [ Added to <i><b><Text translation={getTabText(formBuilder.defaultTabId)} /></b></i> tab by default ]
            </Typography>

          </CardContent>
          {
            announcementDetailRow.helpText && <CardContent className={classes.announcementDetailTextDescription}>
              <Markdown>{announcementDetailRow.helpText}</Markdown>
            </CardContent>
          }
          <Box className={classes.componentDisplayBox}>
            {componentToRender(getFormComponentDetails(formBuilder))}
          </Box>
          {
            formBuilder.describingText && <CardContent className={classes.announcementDetailTextDescription}>
              <Markdown>{formBuilder.describingText}</Markdown>
            </CardContent>
          }
        </>}
        {!formBuilder && announcementDetailRow.helpText && <CardContent className={classes.announcementDetailTextDescription}>
          <Markdown>{announcementDetailRow.helpText}</Markdown>
        </CardContent>
        }
        {
          formBuilder && conflictingElementsMap[announcementDetailRow.id]?.options?.length
          && <RadioGroup name="selectedResolution" value={selectedOption} onChange={optionSelected}>
            <Grid container className={classes.conflictingElementsMapContainer}>
              <Grid item xs={6} className={classes.announcementDetailOptionsArea}>
                <FormControlLabel value={SELECTED_RESOLUTION_ENUM.EXISTING} control={<Radio />}
                  label="Existing Options" className={classes.announcementDetailOptionsHeading} />
                <Typography className={classes.announcementDetailOptionsText}>
                  { (conflictingElementsMap[announcementDetailRow.id].options as FBOption[])?.map(option => option.text).join(', ') }
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.announcementDetailOptionsArea}>
                <FormControlLabel value={SELECTED_RESOLUTION_ENUM.NEW} control={<Radio />}
                  label="New Options" className={classes.announcementDetailOptionsHeading} />
                <Typography className={classes.announcementDetailOptionsText}>
                  { (formBuilder.options)?.map(option => option.text).join(', ') }
                </Typography>
              </Grid>
              <Typography variant="body2">
                <i>Please select one of the options to proceed. Note that if the new options are fewer than the current ones, it may result in data loss.</i>
              </Typography>
            </Grid>
          </RadioGroup>
        }
      </Card>
    </Grid>
  );
};

export default AnnouncementDetail;
