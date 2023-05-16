import { Box, Grid, Typography, withStyles, WithStyles } from '@material-ui/core';
import { truncate } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { convertHtmlEntities } from '../../../common/utils/helpers';
import Text from '../../components/Text';
import styles from './styles';
import { SummaryBaseProps } from './types';

type Props = SummaryBaseProps & WithStyles<typeof styles>;

const LENGTH_LIMIT = 100;

const BaseWithhtml: React.FunctionComponent<Props> = ({
  label,
  value,
  classes,
  labelStyle,
}) => {
  const [isTruncated, setIsTruncated] = useState(true);
  const toggleIsTruncated = useCallback(
    () => setIsTruncated((prevValue) => !prevValue),
    []
  );

  const sanitizedValue = value ? convertHtmlEntities(value.replace(/(<([^>]+)>|\/n)/g, '')) : '';
  const isValueOverLimit = sanitizedValue.length > LENGTH_LIMIT;
  const truncatedValue = isValueOverLimit && isTruncated
    ? truncate(sanitizedValue, {
      length: LENGTH_LIMIT,
      separator: ' ',
    })
    : sanitizedValue;
  const displayValue = truncatedValue.trim();

  const intl = useIntl();
  const btnText =
    intl.formatMessage({ id: isTruncated ? 'document.revision.view.more' : 'document.revision.view.less' });

  return (
    <Grid item={true} xs={12} className={classes.root}>
      {label && (
        <Grid item={true} xs={12} id="BaseWithhtml-label">
          <Typography style={labelStyle}>
            <Text message={label} />
          </Typography>
        </Grid>
      )}
      <Grid item={true} xs={12} id="BaseWithhtml-editor" data-cy="BaseWithhtml-editor">
        <Box className={classes.description}>
          {displayValue}
          {isValueOverLimit && (
            <span className={classes.button}
              onClick={toggleIsTruncated}>
              {btnText}
            </span>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default withStyles(styles)(BaseWithhtml);
