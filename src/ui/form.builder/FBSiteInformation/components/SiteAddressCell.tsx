import { Grid, Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { translate } from '../../../../common/intl';
import SwitchControl from '../../../administration/general.settings/components/SwitchControl';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../components/OverflowContent';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomSiteTemplateProps, EditableSite } from '../types';
import styles from './styles';

const Editor: React.FC<CustomSiteTemplateProps> = ({ field, dataItem, onSameAsHQ }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps, values, setFieldValue }
    = useFormikContext<EditableSite>();
  const [selected, setSelected] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelected((prevSelected) => !prevSelected);
    setFieldValue('isSameAsHQ', !selected);
    onSameAsHQ?.(!selected, values);
  };

  useEffect(() => {
    setSelected(values.isSameAsHQ);
  }, [values]);

  return (
    <Grid container spacing={2} direction="row" alignItems="center">
      <Grid item>
        <SwitchControl checked={selected} onChange={handleChange} label="" />
      </Grid>
      <Grid item>
        <FormikField name={field}>
          <TextField
            {...getFieldProps(field)}
            defaultValue={undefined}
            type="text"
            size="small"
          />
        </FormikField>
      </Grid>
    </Grid>
  );
};

export const SiteAddressCell: React.FC<CustomSiteTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const classes = styles();
  const isEditMode
    = dataItem[MODE_FIELD]
    && [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });
  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <Grid container spacing={2} direction="row" alignItems="center">
      <Grid item>
        <Tooltip arrow placement="top" title={translate('customer.site.information.same.as.hq.label')} PopperProps={{ style: { zIndex: 2000 } }} >
          <span><SwitchControl checked={dataItem?.isSameAsHQ} label="" disabled /></span>
        </Tooltip>
      </Grid>
      <Grid item className={classes.sideAddress}>
        <OverflowContent onClick={handleClick}>{displayValue}</OverflowContent>
      </Grid>
    </Grid>
  );
};
