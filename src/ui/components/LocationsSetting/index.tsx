import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider } from 'formik';
import React from 'react';
import { Button } from '../forms/fields-next';
import KendoDataGrid from '../KendoDataGrid/KendoDataGrid';
import Text from '../Text';
import useStyles from './styles';
import { LocationProps, EditableLocation } from './types';
import { DataGridProps } from '../KendoDataGrid/KendoDataGrid.types';
import { Mode, MODE_FIELD } from '../KendoDataGrid/constants';
import { kebabCase } from 'lodash';

const LocationsSetting: React.FC<LocationProps> = ({
  formik,
  locationsList,
  schema,
  editedLocation,
  addLocation,
  onRowClick,
  isActive = true,
}) => {
  const classes = useStyles();

  const rowRender: DataGridProps<EditableLocation>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableLocation;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    const dataCy = `row-${kebabCase(item.name)}`;

    return React.cloneElement(
      row,
      {
        ['data-cy' as string]: dataCy,
        className: cx(row.props.className, { [classes.updatingRow]: isUpdating }),
      },
    );
  };

  return (
    <Box className={classes.root}>
      <FormikProvider value={formik}>
        <KendoDataGrid
          data={locationsList}
          schema={schema}
          onRowClick={onRowClick}
          rowRender={rowRender}
          className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        />
        {isActive && (
          <Button
            attached
            fullWidth
            kind="add"
            data-cy="form-builder-add-another-location"
            disabled={editedLocation !== undefined}
            onClick={addLocation}
          >
            <Text message="settings.locations.add" />
          </Button>
        )}
      </FormikProvider>
    </Box>
  );
};

export default LocationsSetting;
