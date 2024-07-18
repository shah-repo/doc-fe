import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Dialog } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { last, omit } from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import { translate } from '../../../common/intl';
import { TIME_ZONE } from '../../../common/utils/date';
import { companySelectors } from '../../../state/ducks/company';
import { TrainingRecordQuery } from '../../../state/ducks/training/types';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Button, ButtonGroup } from '../../components/forms/fields-next';
import useDialog from '../../hooks/useDialog';
import TrainingDetails from '../../training/details/TrainingDetails';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import { FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableTrainee, Trainee, TraineeEditEvent, TraineeListProps } from './types';
import { withTraineeList } from './wrap';

const TraineeList: React.FC<TraineeListProps> = (props) => {
  const {
    type,
    name,
    label = 'training.record.trainees.list',
    disabled = false,
    updateTrainee,
    deleteTrainee,
    trainees = [],
    documentOptions = [],
    documentOptionsAsync,
  } = props;
  const classes = useStyles();
  const [editedTrainee, setEditedTrainee] = React.useState<Partial<EditableTrainee>>();
  const [dialogTrainee, setDialogTrainee] = React.useState<TrainingRecordQuery>();
  const trainingRecordDialog = useDialog();

  const isActive = !disabled;
  const isTraineeAdding = editedTrainee?.[MODE_FIELD] === Mode.add;

  const editTrainee = ({ dataItem }: TraineeEditEvent) => setEditedTrainee(dataItem);
  const openTrainee = ({ dataItem }: TraineeEditEvent) => {
    const record = dataItem.trainingRecord;

    if (!record) {
      return;
    }

    record.attachments = dataItem.attachments;

    trainingRecordDialog.open();
    setDialogTrainee(record);
  };
  const isInEditMode = editedTrainee !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editTrainee : openTrainee;
  const companyMine = useSelector(companySelectors.getCompanyMine);

  const formik = useFormik<Partial<EditableTrainee>>({
    initialValues: {},
    validationSchema: Yup.object().shape({
      employee: Yup.object().required('common.required'),
      trainingDocument: Yup.object().required('common.required'),
      trainingCompletionDate: Yup.string().required('common.required'),
    }),
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
    trainingCompletionDate: moment().tz(TIME_ZONE).startOf('day').toISOString(),
    createdAt: new Date().toISOString(),
    [MODE_FIELD]: Mode.add,
  });

  const discardTrainee = () => setEditedTrainee(undefined);

  const removeTrainee = () => {
    if (!isTraineeAdding) {
      deleteTrainee?.(editedTrainee as Trainee);
    }

    return discardTrainee();
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

  const handleAddLastButtonClick = () => {
    if (!traineeList?.length) {
      return createDraftTrainee();
    }

    const lastTrainee = last(traineeList);

    setEditedTrainee({
      id: uuidv4(),
      trainingCompletionDate: lastTrainee?.trainingCompletionDate,
      trainingDocument: lastTrainee?.trainingDocument,
      createdAt: new Date().toISOString(),
      [MODE_FIELD]: Mode.add,
    });
  };

  const schema = buildSchema({
    employees: companyMine.employees ?? [],
    documentOptions,
    actionsClass: classes.actionsCell,
    onRowClick: handleRowClick,
    onConfirm: submitForm,
    onDiscard: discardTrainee,
    onDelete: removeTrainee,
  });

  const traineeList = trainees.reduce((list, item) => {
    const isTraineeEdited = editedTrainee && editedTrainee.id === item.id;
    return [
      {
        ...(isTraineeEdited ? editedTrainee : item),
        [MODE_FIELD]: isTraineeEdited ? Mode.edit : Mode.show,
      },
      ...list,
    ];
  }, isTraineeAdding ? [editedTrainee] : []);

  const lastTrainee = last(traineeList);
  const isAddingLastAllowed = Boolean(lastTrainee?.trainingDocument);

  return (
    <Box className={classes.root} data-cy="traineeList">
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type={type} name={name}>
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
      </FBInput>
      <KendoDataGrid<EditableTrainee>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={traineeList as EditableTrainee[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
        loading={documentOptionsAsync.loading}
      />
      {isActive && (
        <ButtonGroup
          variant="outlined"
          color="secondary"
          fullWidth
          disabled={isInEditMode}
        >
          {isAddingLastAllowed && (
            <Button
              kind="add"
              attached
              onClick={handleAddLastButtonClick}
              data-cy="add-last-button"
            >
              {translate('form.builder.trainee.list.add.previous')}
            </Button>
          )}
          <Button
            kind="add"
            fullWidth
            attached
            disabled={isInEditMode}
            onClick={createDraftTrainee}
            data-cy="add-button"
            className={cx({ [classes.fitContent]: isAddingLastAllowed })}
          >
            {translate('training.record.trainees.add')}
          </Button>
        </ButtonGroup>
      )}
      {trainingRecordDialog.isOpen && dialogTrainee && (
        <Dialog
          open={trainingRecordDialog.isOpen}
          classes={{ paper: classes.dialogContent }}
          fullWidth
          maxWidth="md"
          onEscapeKeyDown={trainingRecordDialog.close}
          onBackdropClick={trainingRecordDialog.close}
        >
          <TrainingDetails
            dialog={trainingRecordDialog}
            training={dialogTrainee}
          />
        </Dialog>
      )}
    </Box>
  );
};

export default withTraineeList(TraineeList);
