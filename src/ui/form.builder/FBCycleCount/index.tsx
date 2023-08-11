import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Grid } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { omit } from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../common/intl';
import { MomentFormats, getFormattedDateString } from '../../../common/utils/date';
import KendoDataGrid from '../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../components/KendoDataGrid/KendoDataGrid.types';
import { MODE_FIELD, Mode } from '../../components/KendoDataGrid/constants';
import PromptIfDirty from '../../components/forms/PromptIfDirty';
import { Button, FormField, TextField } from '../../components/forms/fields-next';
import FBInput from '../FBInput/FBInput';
import FBSection from '../FBSection/FBSection';
import { ActionsCell } from './components/ActionsCell';
import { DATE_FIELD, EMPLOYEE_FIELD, EMPTY_VALUE_PLACEHOLDER, FIELDS_TO_OMIT } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { CycleCount, CycleCountEditEvent, EditableCycleCount, FBCycleCountProps } from './types';
import { withFBCycleCount } from './wrap';

const FBCycleCount: React.FC<FBCycleCountProps> = ({
  label = 'form.builder.cycle.count.title',
  name = '',
  disabled,
  cycleCounts = [],
  employees = [],
  onHandQuantity,
  onHandQuantityUnit,
  cycleCountFrequency,
  deleteCycleCount,
  updateCycleCount,
  ...props
}) => {
  const classes = useStyles();
  const isActive = !disabled;
  const [editedCycleCount, setEditedCycleCount] = React.useState<Partial<EditableCycleCount>>();

  const isCycleCountAdded = editedCycleCount?.[MODE_FIELD] === Mode.add;

  const editCycleCount = ({ dataItem }: CycleCountEditEvent) => setEditedCycleCount(dataItem);
  const isInEditMode = editedCycleCount !== undefined;
  const handleRowClick = isActive && !isInEditMode ? editCycleCount : undefined;

  const formik = useFormik<Partial<EditableCycleCount>>({
    initialValues: {},
    onSubmit: (values) => {
      const CycleCountDataToSave = omit(values, FIELDS_TO_OMIT);
      updateCycleCount?.(CycleCountDataToSave as CycleCount);
      discardCycleCount();
    },
  });

  const { resetForm, setValues, dirty } = formik;

  useEffect(() => {
    resetForm({ values: editedCycleCount ?? {} });
  }, [editedCycleCount, setValues, resetForm]);

  const createDraftCycleCount = () => setEditedCycleCount({
    id: uuidv4(),
    date: new Date().toISOString(),
    [MODE_FIELD]: Mode.add,
  });

  const discardCycleCount = () => setEditedCycleCount(undefined);

  const removeCycleCount = () => {
    if (!editedCycleCount) {
      return;
    }
    deleteCycleCount?.(editedCycleCount as CycleCount);
    discardCycleCount();
  };

  const rowRender: DataGridProps<EditableCycleCount>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as EditableCycleCount;
    const isUpdating = [Mode.add, Mode.edit].includes(item[MODE_FIELD]);
    if (!isUpdating) {
      return row;
    }

    const actions = (
      <td className={classes.actionsCell} key="actions">
        <ActionsCell
          dataItem={item}
          onConfirm={formik.submitForm}
          onDiscard={discardCycleCount}
          onDelete={removeCycleCount}
          rootClassName={classes.popperHolder}
        />
      </td>
    );

    const editedRow = React.cloneElement(
      row,
      {
        className: cx(row.props.className, classes.updatingRow),
      },
      [row.props.children, actions],
    );

    return (
      <FormikProvider value={formik}>
        {editedRow}
      </FormikProvider>
    );
  };

  const schema = buildSchema({
    onHandQuantity,
    onHandQuantityUnit,
    onRowClick: handleRowClick,
  });

  const cycleCountsList = cycleCounts.reduce((list, item) => {
    const isCycleCountEdited = editedCycleCount && editedCycleCount.id === item.id;
    const employee = employees.find(employee => employee.id === item.by);
    const employeeName = employee?.user?.name ?? EMPTY_VALUE_PLACEHOLDER;
    const formattedDate = getFormattedDateString(item.date, MomentFormats.DateTimeComplete);

    return [
      ...list,
      {
        ...(isCycleCountEdited ? editedCycleCount : item),
        [EMPLOYEE_FIELD]: employeeName,
        [DATE_FIELD]: formattedDate,
        [MODE_FIELD]: isCycleCountEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isCycleCountAdded ? [editedCycleCount] : []);

  const nextDueDate = moment(cycleCountsList.at(0)?.date).add(cycleCountFrequency, 'days').format(MomentFormats.MonthDateYearTwoDigit);

  return (
    <Box className={classes.root}>
      <PromptIfDirty
        dirty={dirty}
      />
      <FBInput {...props} type="cycleCount" name={name}>
        <FBSection label={label}>
          {isActive && (
            <Button
              kind="ghost"
              size="small"
              className={classes.addButton}
              startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
              onClick={createDraftCycleCount}
            >
              {translate('form.builder.cycle.count.add')}
            </Button>
          )}
        </FBSection>
      </FBInput>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <FormField label="Cycle Count Frequency (days)" margin="normal">
            <TextField
              value={cycleCountFrequency}
              disabled
            />
          </FormField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormField label="Next Due Date" margin="normal">
            <TextField
              value={cycleCountFrequency ? nextDueDate : ''}
              disabled
            />
          </FormField>
        </Grid>
      </Grid>
      <KendoDataGrid<EditableCycleCount>
        className={cx(classes.grid, { [classes.gridWithButton]: isActive })}
        fullWidth
        filterable
        hasBoxScrollbars
        schema={schema}
        data={cycleCountsList as EditableCycleCount[]}
        onRowClick={handleRowClick}
        rowRender={rowRender}
      />
      {isActive && (
        <Button
          kind="add"
          fullWidth
          attached
          onClick={createDraftCycleCount}
        >
          {translate('form.builder.cycle.count.add')}
        </Button>
      )}
    </Box>
  );
};

export default withFBCycleCount(FBCycleCount);
