import { Box } from '@material-ui/core';
import { Input, InputProps } from '@progress/kendo-react-inputs';
import { debounce, get } from 'lodash';
import React from 'react';
import { translate } from '../../../../../common/intl';
import { CellTemplate } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import OverflowTooltip from '../../../../components/OverflowTooltip';
import useStyles from '../../styles';
import { MODE_FIELD, Mode } from '../Grid';

const InputCellTemplate: CellTemplate = (props) => {
  const { dataItem, field, dataIndex, column, onChange } = props;
  const { title, editable, required } = column;
  const mode = get(dataItem, MODE_FIELD);
  const path = field ?? '';
  const value = String(get(dataItem, path) ?? '');

  const classes = useStyles();
  const [error, setError] = React.useState('');

  const canBeModified = (Boolean(editable) && mode === Mode.edit) || mode === Mode.add;

  const handleChange: InputProps['onChange'] = debounce(
    (event) => {
      if (required && !event.value) {
        setError('validators.required');
        return;
      } setError('');

      onChange?.({
        dataIndex,
        dataItem,
        syntheticEvent: event.syntheticEvent,
        field,
        value: event.value,
      });
    },
    500,
  );

  const handleBlur: InputProps['onBlur'] = (event) => {
    if (required && !event.currentTarget.value) {
      setError('validators.required');
    } else {
      setError('');
    }
  };

  if (!canBeModified) {
    return (
      <OverflowTooltip
        arrow
        placement="top"
        title={value ?? ''}
      >
        {value || '-'}
      </OverflowTooltip>);
  }

  return (
    <>
      <Input
        placeholder={translate(title)}
        defaultValue={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {error && <Box className={classes.error}>{translate(error)}</Box>}
    </>
  );
};

export default InputCellTemplate;
