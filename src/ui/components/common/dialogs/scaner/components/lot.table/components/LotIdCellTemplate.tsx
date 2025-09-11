import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../../../../../common/intl';
import { MomentFormats, useDate } from '../../../../../../../../common/utils/date';
import { StyleTooltip } from '../../../../../../../dashboard.new/line.items/common/StyleTooltip';
import { Colors } from '../../../../../../../layout/theme-next';
import { Autocomplete, FormikField } from '../../../../../../forms/fields-next';
import { CustomTemplateProps } from '../types';
import useStyles from './styles';

export const LotIdCellTemplate: React.FC<CustomTemplateProps> = ({ field, dataItem }) => {
  const classes = useStyles();
  const options = [{ label: dataItem[field]?.name, value: dataItem[field]?.id }];
  const { getFormattedDateString } = useDate();

  return (
    <Box className={classes.lotContainer}>
      <FormikField name={field}>
        <Autocomplete
          classes={{ option: classes.option }}
          disableClearable
          placeholder={translate('common.scan')}
          options={options}
          data-cy="lot-id-field"
          value={options[0]}
          disabled
          getOptionLabel={(option) => option?.label ?? ''}
          size="small"
        />
      </FormikField>
      {dataItem.isExpired && (
        <StyleTooltip
          title={translate('allocation.lot.expired.tooltip.message', {
            expiryDate: getFormattedDateString(dataItem.expiryDate, MomentFormats.MonthDateYearTwoDigit),
          })}
          arrow
          placement="top"
        >
          <FontAwesomeIcon icon={solid('circle-exclamation')} color={Colors.error} className={classes.icon} />
        </StyleTooltip>
      )}
    </Box>
  );
};
