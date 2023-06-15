import { Box, Typography } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { kebabCase, omit, unionBy } from 'lodash';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { companyActions } from '../../../../state/ducks/company';
import { CompanyLocation } from '../../../../state/ducks/company/types';
import KendoDataGrid from '../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps, DataGridRowClickEvent } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import Text from '../../../components/Text';
import { Button } from '../../../components/forms/fields-next';
import { toastError } from '../../../components/notifications';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { MODE_FIELD, Mode } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableCompanyLocation, Props } from './types';

export const CompanyLocations: React.FC<Props> = ({
  locations = [],
  isActive = false,
  ...props
}) => {
  const editLocation = ({ dataItem }: DataGridRowClickEvent<EditableCompanyLocation>) => setEditedLocation(dataItem);
  const discardLocation = () => setEditedLocation(undefined);
  const [locationsData, setLocationsData] = React.useState<CompanyLocation[]>(locations);

  const async = useAsync({
    onError: (error) => {
      setLocationsData(locations);
      toastError(error);
    },
  });
  const changeCompanyAction = useActionCreator(companyActions.updateCompanyMine);

  const [editedLocation, setEditedLocation] = React.useState<EditableCompanyLocation>();
  const formik = useFormik<EditableCompanyLocation | Record<string, never>>({
    initialValues: {},
    onSubmit: (values) => {
      const updatedLocations = unionBy([omit(values, MODE_FIELD)], locations, 'id');
      setLocationsData(updatedLocations);
      discardLocation();
      async.start(changeCompanyAction, { locations: updatedLocations }, async);
    },
  });
  const classes = useStyles();
  const { setValues, submitForm } = formik;

  useEffect(() => {
    setValues(editedLocation ?? {});
  }, [editedLocation, setValues]);

  useEffect(() => {
    setLocationsData(locations);
  }, [locations]);

  const addLocation = () => setEditedLocation({
    id: uuidv4(),
    name: '',
    active: true,
    [MODE_FIELD]: Mode.add,
  });

  const mappedLocations = locationsData.map((location) => {
    return {
      ...location,
      [MODE_FIELD]: location.id === editedLocation?.id ? Mode.edit : Mode.show,
    };
  });

  const locationsList
    = editedLocation?.[MODE_FIELD] === Mode.add
      ? [...mappedLocations, editedLocation]
      : mappedLocations;

  const rowRender: DataGridProps<EditableCompanyLocation>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableCompanyLocation;
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

  const schema = buildSchema({
    isActive,
    actionsClass: classes.actionsCell,
    onDiscard: discardLocation,
    onConfirm: submitForm,
  });

  return (
    <Box className={classes.root}>
      <Typography variant="h6">
        <Text message="settings.locations" />
      </Typography>
      <FormikProvider value={formik}>
        <KendoDataGrid
          data={locationsList}
          schema={schema}
          onRowClick={isActive ? editLocation : undefined}
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
