import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, List, ListItem, Typography } from '@material-ui/core';
import moment from 'moment';
import React, { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { MomentFormats } from '../../../../common/utils/date';
import { bkStatusTextMap } from '../../../../state/ducks/bulkImport/constants';
import { getBulkImportsGroupByProcess } from '../../../../state/ducks/bulkImport/selectors';
import { BulkImportCustom, BulkImportFile } from '../../../../state/ducks/bulkImport/types';
import Text from '../../../components/Text';
import useStyles from './styles';

const ImportLog: React.FC = () => {
  const classes = useStyles();
  const bulkImportsGroupByProcess = useSelector(getBulkImportsGroupByProcess);

  const renderItem = (text, formattedDate) => (
    <ListItem className={classes.listItem}>
      <Typography className={classes.primaryText}>
        {text}
      </Typography>
      <Typography className={classes.secondaryText} color="textSecondary">
        {formattedDate}
      </Typography>
    </ListItem>
  );

  const renderFileData = (file: BulkImportFile) => {
    // Create a new Date object from the createdAt string
    const date = new Date(file.createdAt);

    // Format the date as MM/DD/YYYY
    const formattedDate = moment(date).format(MomentFormats.MonthDateYearTwoDigit);

    return renderItem(`${file.name}.${file.type}`, formattedDate);
  };

  const renderS3Link = (s3Link: string, createdAt: string) => {
    const date = new Date(createdAt);

    // Format the date as MM/DD/YYYY
    const formattedDate = moment(date).format(MomentFormats.MonthDateYearTwoDigit);

    return renderItem(s3Link, formattedDate);
  };

  return (
    <Box className={classes.container}>
      <Typography className={classes.title} variant="h4"><Text translation="bulkImport.progress.importLog" /></Typography>
      {Object.keys(bulkImportsGroupByProcess).length > 0 && <Box className={classes.backgroundItems}>
        {Object.keys(bulkImportsGroupByProcess).map(key => (
          <Box key={key}>
            <Box className={classes.categoryTitleContainer}>
              <FontAwesomeIcon
                className={classes.chevronRightIcon}
                icon={solid('chevron-right')}
              />
              <Typography className={classes.categoryTitle} variant="subtitle1">{bkStatusTextMap[key] || ''}</Typography>
            </Box>
            <List className={classes.listCategory}>
              {bulkImportsGroupByProcess[key]?.map((item: BulkImportCustom, idx: number) => {
                if (!item.excelFile && item.zipFile) return null;

                return (
                  <Fragment key={`${item.id}-${idx}`}>
                    {item.s3Link ? renderS3Link(item.s3Link, item.createdAt) : null}
                    {item.excelFile ? renderFileData(item.excelFile) : null}
                    {item.zipFile ? renderFileData(item.zipFile) : null}
                  </Fragment>
                );
              }).filter(item => !!item)}
            </List>
          </Box>
        ))}
      </Box>}
    </Box>
  );
};

export default ImportLog;
