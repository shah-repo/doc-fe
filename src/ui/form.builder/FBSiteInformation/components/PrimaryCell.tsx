import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import { useFormikContext } from 'formik';
import get from 'lodash/get';
import React, { useEffect, useState } from 'react';
import {
  MODE_FIELD,
  Mode,
} from '../../../components/KendoDataGrid/constants';
import { Radio } from '../../../components/forms/fields-next';
import { CustomSiteTemplateProps, EditableSite } from '../types';
import useStyles from './styles';
interface Props extends CustomSiteTemplateProps {
  isActive: boolean
  isInEditMode: boolean
  onPrimaryChange?: (id: string) => void
  onDataItemExpanded?: (dataItem: EditableSite) => void
}

const Editor: React.FC<Props> = ({ field, dataIndex }) => {
  const { values, setFieldValue } = useFormikContext<EditableSite>();
  const [selected, setSelected] = useState(false);
  const classes = useStyles();

  const handleChange = () => {
    setSelected((prevSelected) => !prevSelected);
    setFieldValue(field, !selected);
  };

  useEffect(() => {
    setSelected(values[field]);
  }, [values]);

  return (
    <Box className={classes.radioContainer}>
      <Radio
        checked={selected}
        color="primary"
        size="small"
        name={`${field}-edit-${dataIndex}`}
        onClick={handleChange}
      />
    </Box>
  );
};

export const PrimaryCell: React.FC<Props> = (props) => {
  const { dataIndex, dataItem, isInEditMode, onPrimaryChange, field, onDataItemExpanded } = props;
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const classes = useStyles();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditMode) {
      return;
    }
    const id = event.target.value;
    if (id && onPrimaryChange) {
      onPrimaryChange(id);
    }
  };
  if (isEditMode) {
    return <Editor {...props} />;
  }
  console.log('dataItem', dataItem);

  return (
    <Box display="flex" justifyContent="center">
      <div className={classes.expand}>
        <FontAwesomeIcon
          data-cy="minimize-row-button"
          flip={get(dataItem, '_expanded') ? undefined : 'horizontal'}
          icon={solid('square-chevron-left')}
          onClick={() => onDataItemExpanded?.(dataItem)}
        />
      </div>
      <Radio
        checked={dataItem[field]}
        color="primary"
        size="small"
        value={dataItem.id}
        name={`${field}-${dataIndex}`}
        onChange={handleChange}
        disabled={isInEditMode}
      />
    </Box>
  );
};
