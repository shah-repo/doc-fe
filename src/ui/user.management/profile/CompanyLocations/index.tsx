import { Box } from '@material-ui/core';
import { useFormik } from 'formik';
import { omit, unionBy } from 'lodash';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { companyActions } from '../../../../state/ducks/company';
import { CompanyLocation } from '../../../../state/ducks/company/types';
import { DataGridRowClickEvent } from '../../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../../components/KendoDataGrid/constants';
import LocationsSetting from '../../../components/LocationsSetting';
import { buildSchema } from '../../../components/LocationsSetting/schema';
import useStyles from '../../../components/LocationsSetting/styles';
import { toastError } from '../../../components/notifications';
import useActionCreator from '../../../hooks/useActionCreator';
import useAsync from '../../../hooks/useAsync';
import { EditableCompanyLocation, Props } from './types';

export const CompanyLocations: React.FC<Props> = ({
  locations = [],
  isActive = false,
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
    validate: (values) => {
      const error: Record<string, string> = {};
      const isDuplicate = locations.some(({ name, id }) => name.toLowerCase() === values.name.toLowerCase() && id !== values.id);
      if (values.name && isDuplicate) {
        error.name = 'validator.location.same.name.exist';
      }
      return error;
    },
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

  const mappedLocations = locationsData?.map((location) => {
    return {
      ...location,
      [MODE_FIELD]: location.id === editedLocation?.id ? Mode.edit : Mode.show,
    };
  }) ?? [];

  const locationsList
    = editedLocation?.[MODE_FIELD] === Mode.add
      ? [...mappedLocations, editedLocation]
      : mappedLocations;

  const onRowClick = isActive ? editLocation : undefined;

  const schema = buildSchema({
    isActive,
    actionsClass: classes.actionsCell,
    onDiscard: discardLocation,
    onConfirm: submitForm,
  });

  return (
    <Box className={classes.root}>
      <LocationsSetting {...{ formik, locationsList, schema, editedLocation, addLocation, onRowClick }} />
    </Box>
  );
};
