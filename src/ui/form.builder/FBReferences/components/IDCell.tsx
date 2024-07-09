import { regular, solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Grid, Tooltip } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { translate } from '../../../../common/intl';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import OverflowContent from '../../../components/OverflowContent';
import { FormikField, TextField } from '../../../components/forms/fields-next';
import useHover from '../../../hooks/useHover';
import { Colors } from '../../../layout/theme-next';
import { EMPTY_VALUE_PLACEHOLDER } from '../constants';
import { CustomTemplateProps } from '../types';
import { styles } from './styles';

const Editor: React.FC<CustomTemplateProps> = ({ field }) => {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { getFieldProps } = useFormikContext();

  return (
    <FormikField
      name={field}
    >
      <TextField
        {...getFieldProps(field)}
        defaultValue={undefined}
        type="text"
        size="small"
      />
    </FormikField>
  );
};

export const IDCell: React.FC<CustomTemplateProps> = (props) => {
  const { field, dataItem, onClick } = props;
  const classes = styles();
  const isEditMode = [Mode.add, Mode.edit].includes(dataItem[MODE_FIELD]);
  const [viewIconRef, isHovered] = useHover<HTMLButtonElement>();

  if (isEditMode) {
    return <Editor {...props} />;
  }

  const handleClick = () => onClick?.({ dataItem });

  const displayValue = get(dataItem, field, EMPTY_VALUE_PLACEHOLDER) as string;

  return (
    <OverflowContent onClick={handleClick}>
      <Grid
        justify="space-between"
        alignItems="center"
        container
      >
        <span className={classes.referenceIdCell}>{displayValue}</span>
        <span ref={viewIconRef}>
          <Tooltip
            arrow
            title={translate('common.quick.view')}
            placement="top"
          >
            <FontAwesomeIcon
              data-cy="quick-view"
              icon={isHovered ? solid('eye') : regular('eye')}
              color={isHovered ? Colors.navigationBg : Colors.textGray}
            />
          </Tooltip>
        </span>
      </Grid>
    </OverflowContent>
  );
};
