import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider } from 'formik';
import { kebabCase } from 'lodash';
import React from 'react';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../../components/KendoDataGrid/constants';
import Text from '../../../../components/Text';
import { Button } from '../../../../components/forms/fields-next';
import useStyles from './styles';
import { EditableLocation, LocationProps } from './types';

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
        {/* <div className={classes.tableContainer}> */}
        <KendoDataGrid
          data={locationsList}
          schema={schema}
          onRowClick={onRowClick}
          rowRender={rowRender}
          className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        />
        {/* </div> */}
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
