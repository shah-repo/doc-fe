import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import { companySelectors } from '../../../state/ducks/company';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Button } from '../../components/forms/fields-next';
import FBSection from '../FBSection/FBSection';
import { EMPTY_VALUE_PLACEHOLDER, FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableTrainee, Trainee, TraineeEditEvent, TrainingListTableProps } from './types';
import { getOptionLabel } from './utils';
import { withTrainingListTable } from './wrap';

const TrainingListTable: React.FC<TrainingListTableProps> = (props) => {
  const {
    label = 'training.record.trainees.list',
    setPrimaryTrainee,
    disabled = false,
    updateTrainee,
    // setPrimaryVendor,
    trainees = [],
    records = [],
  } = props;
  const classes = useStyles();
  const isActive = !disabled;
  const [editedTrainee, setEditedTrainee] = React.useState<Partial<EditableTrainee>>();

  const isTraineeAdded = editedTrainee?.[MODE_FIELD] === Mode.add;

  const editTrainee = ({ dataItem }: TraineeEditEvent) => setEditedTrainee(dataItem);
  const isInEditMode = editedTrainee !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editTrainee : undefined;
  const companyMine = useSelector(companySelectors.getCompanyMine);

  const formik = useFormik<Partial<EditableTrainee>>({
    initialValues: {},
    onSubmit: (values) => {
      const traineeToSave = omit(values, FIELDS_TO_OMIT);
      updateTrainee?.(traineeToSave as Trainee);
      discardTrainee();
    },
  });

  const { submitForm, resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedTrainee ?? {} });
  }, [editedTrainee, setValues, resetForm]);

  const createDraftTrainee = () => setEditedTrainee({
    id: uuidv4(),
    date: new Date().toISOString(),
    [MODE_FIELD]: Mode.add,
  });

  const discardTrainee = () => setEditedTrainee(undefined);

  const removeTrainee = () => {
    if (!editedTrainee) {
      return;
    }
    // deleteTrainee?.(editedTrainee as Trainee);
    discardTrainee();
  };

  const rowRender: DataGridProps<EditableTrainee>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableTrainee;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    if (!isUpdating) {
      return row;
    }

    const editedRow = React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
    );

    return (
      <FormikProvider value={formik}>
        {editedRow}
      </FormikProvider>
    );
  };

  const schema = buildSchema({
    primaryOwners: companyMine.employees ?? [],
    isActive,
    isInEditMode,
    records,
    actionsClass: classes.actionsCell,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardTrainee,
    onDelete: removeTrainee,
    onPrimaryChange: setPrimaryTrainee,
  });

  const traineeList = trainees.reduce((list, item) => {
    const isTraineeEdited = editedTrainee && editedTrainee.id === item.id;
    const reference = records?.find(record => record.id === item.reference?.id);
    const referenceName = reference ? getOptionLabel(reference) : EMPTY_VALUE_PLACEHOLDER;
    return [
      ...list,
      {
        ...(isTraineeEdited ? editedTrainee : item),
        referenceName: referenceName,
        [MODE_FIELD]: isTraineeEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isTraineeAdded ? [editedTrainee] : []);

  return (
    <Box className={classes.root} data-cy="traineeList">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBSection label={label}>
        {isActive && (
          <Button
            kind="ghost"
            size="small"
            disabled={isInEditMode}
            className={classes.addButton}
            startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
            onClick={createDraftTrainee}
            data-cy="add-link"
          >
            {translate('training.record.trainees.add')}
          </Button>
        )}
      </FBSection>
      <KendoDataGrid<EditableTrainee>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={traineeList as EditableTrainee[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          disabled={isInEditMode}
          onClick={createDraftTrainee}
          data-cy="add-button"
        >
          {translate('training.record.trainees.add')}
        </Button>
      )}
    </Box>
  );
};

export default withTrainingListTable(TrainingListTable);
export * from './utils';
