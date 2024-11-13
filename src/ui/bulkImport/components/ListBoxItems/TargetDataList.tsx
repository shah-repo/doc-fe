import { Box, List, ListItem, Typography } from '@material-ui/core';
import React from 'react';
import { translate } from '../../../../common/intl';
import { CustomHeaderEntity, SystemHeaderEntity } from '../../../../state/ducks/bulkImport/types';
import SelectField, { SelectOption } from '../../../components/forms/fields/Select';
import useStyles from './styles';

interface TargetDataListProps {
  data: SystemHeaderEntity[]
  options: CustomHeaderEntity[]
}

const TargetDataList: React.FC<TargetDataListProps> = ({ data, options }) => {
  const classes = useStyles();

  if (!data) return null;

  const optionsList: SelectOption[] = options
    ? [{ value: '', text: translate('common.selectOption') }, ...options.map(val => ({ value: val.id, text: val.name }))]
    : [];

  return (
    <List>
      {data.map((item) => {
        return (
          <ListItem key={item.id}>
            <Box className={classes.listSelectContainer}>
              <Typography className={classes.listSelectText}>{item.name}</Typography>
              <Box className={classes.selectContainer}>
                <SelectField
                  selectProps={{ id: item.id }}
                  name={item.id}
                  includeEmpty={false}
                  options={optionsList}
                  inputStyleProps={classes.select}
                  labelProps={{ className: classes.selectContainer }}
                />
              </Box>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};

export default TargetDataList;
