import { Box, Card, CardContent, Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { FBSchemaState } from '../../form.builder';
import { FBInputProps } from '../../form.builder/types/common';
import { NextTheme } from '../../layout/theme-next/provider';
import Colors from '../../layout/theme/utils/colors';
import { IAnnouncementDetail, IFormBuilder } from './interface';

const useStyles = makeStyles<NextTheme>(theme => ({
  root: {
    width: '100%',
    backgroundColor: Colors.medium_gray,
  },
  title: {
    fontSize: '14px',
  },
  textDescription: {
    color: Colors.dark_gray,
    fontSize: '13px',
    paddingTop: '0',
  },
  componentDisplayBox: {
    padding: theme.spacing(2),
  },
}));

const AnnouncementDetail: React.FC<{
  announcementDetailRow: IAnnouncementDetail
}> = ({ announcementDetailRow }) => {
  const classes = useStyles();

  const { formBuilder } = announcementDetailRow;

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

  return (
    <Grid item lg={12} xl={6}>
      <Card className={classes.root}>
        {formBuilder && <>
          <CardContent>
            <Typography variant="h5">
              <u>{formBuilder.defaultLabel}</u>
            </Typography>
          </CardContent>
          {
            announcementDetailRow.beforeText && <CardContent className={classes.textDescription}>
              <ReactMarkdown>{announcementDetailRow.beforeText}</ReactMarkdown>
            </CardContent>
          }
          <Box className={classes.componentDisplayBox}>
            {componentToRender(getFormComponentDetails(formBuilder))}
          </Box>
          {
            formBuilder.describingText && <CardContent className={classes.textDescription}>
              <ReactMarkdown>{formBuilder.describingText}</ReactMarkdown>
            </CardContent>
          }
        </>}
        {!formBuilder && announcementDetailRow.beforeText && <CardContent className={classes.textDescription}>
          <ReactMarkdown>{announcementDetailRow.beforeText}</ReactMarkdown>
        </CardContent>
        }
      </Card>
    </Grid>
  );
};

export default AnnouncementDetail;
