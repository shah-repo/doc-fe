import { Box, Card, CardContent, FormControlLabel, Grid, makeStyles, Radio, RadioGroup, Typography } from '@material-ui/core';
import Markdown from 'markdown-to-jsx';
import React, { useState } from 'react';
import { FBOption } from '../../../../src/ui/form.builder/index';
import Text from '../../components/Text';
import { FBSchemaState } from '../../form.builder';
import { FBInputProps } from '../../form.builder/types/common';
import { NextTheme } from '../../layout/theme-next/provider';
import Colors from '../../layout/theme/utils/colors';
import { Translation } from '../../translations/types';
import { IAnnouncementDetail, IConflictingItem, IFormBuilder, SELECTED_RESOLUTION_ENUM } from './interface';

const useStyles = makeStyles<NextTheme>(theme => ({
  root: {
    width: '100%',
    backgroundColor: Colors.medium_gray,
  },
  title: {
    fontSize: '14px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  textDescription: {
    color: Colors.dark_gray,
    fontSize: '13px',
    paddingTop: '0',
  },
  componentDisplayBox: {
    padding: theme.spacing(2),
  },
  optionsText: {
    color: Colors.dark_gray,
    fontSize: '13px',
  },
}));

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
      <Card className={classes.root}>
        {formBuilder && <>
          <CardContent className={classes.cardHeader}>
            <Typography variant="h5">
              <u>{formBuilder.defaultLabel}</u>
            </Typography>
            <Typography style={{ color: Colors.font_gray, fontSize: '12px' }}>
              [ Added to <i><b><Text translation={getTabText(formBuilder.defaultTabId)} /></b></i> tab by default ]
            </Typography>

          </CardContent>
          {
            announcementDetailRow.helpText && <CardContent className={classes.textDescription}>
              <Markdown>{announcementDetailRow.helpText}</Markdown>
            </CardContent>
          }
          <Box className={classes.componentDisplayBox}>
            {componentToRender(getFormComponentDetails(formBuilder))}
          </Box>
          {
            formBuilder.describingText && <CardContent className={classes.textDescription}>
              <Markdown>{formBuilder.describingText}</Markdown>
            </CardContent>
          }
        </>}
        {!formBuilder && announcementDetailRow.helpText && <CardContent className={classes.textDescription}>
          <Markdown>{announcementDetailRow.helpText}</Markdown>
        </CardContent>
        }
        {
          formBuilder && conflictingElementsMap[announcementDetailRow.id]?.options?.length
          && <RadioGroup name="selectedResolution" value={selectedOption} onChange={optionSelected}>
            <Grid container style={{ backgroundColor: Colors.light_red, padding: '16px' }}>
              <Grid item xs={6} style={{ padding: '16px' }}>
                <FormControlLabel value={SELECTED_RESOLUTION_ENUM.EXISTING} control={<Radio />}
                  label="Existing Options" style={{ marginLeft: '-8px' }} />
                <Typography className={classes.optionsText}>
                  { (conflictingElementsMap[announcementDetailRow.id].options as FBOption[])?.map(option => option.text).join(', ') }
                </Typography>
              </Grid>
              <Grid item xs={6} style={{ padding: '16px' }}>
                <FormControlLabel value={SELECTED_RESOLUTION_ENUM.NEW} control={<Radio />}
                  label="New Options" style={{ marginLeft: '-8px' }} />
                <Typography className={classes.optionsText}>
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
