import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import { find, map } from 'lodash';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { ChangeRequest } from '../../../../../state/ducks/changeRequest/types';
import { taskActions } from '../../../../../state/ducks/tasks';
import { Button } from '../../../../components/forms/fields-next';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../../../components/notifications';
import { FBSection } from '../../../../form.builder';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { ASSIGNEE_ACTIONS_FIELD, COMMENTS_FIELD } from './constants';
import { EditableTLItem, TasksListItem, TLItemEditEvent } from './interface';
import { buildSchema } from './schema';
import useStyles from './styles';

interface props {
  changeRequest?: ChangeRequest
}

const FBTasksListTable: React.FunctionComponent<props> = ({ changeRequest }) => {
  const classes = useStyles();
  const [editedTLItem, setEditedTLItem] = React.useState<Partial<EditableTLItem>>();
  const isTasksListAdded = editedTLItem?.[MODE_FIELD] === Mode.add;
  // GET API Here
  const [data, setData] = React.useState<Array<Partial<EditableTLItem>>>([]);
  const [isShowOnly, setShowOnly] = React.useState<boolean>(false);
  const editTLItem = ({ dataItem }: TLItemEditEvent) => {
    !isShowOnly && setEditedTLItem(dataItem);
  };
  const discardTLItem = () => setEditedTLItem(undefined);
  const fetchTasksList = useActionCreator(taskActions.fetchTasksList);
  // const updateTask = useActionCreator(taskActions.updateTask);
  const addTask = useActionCreator(taskActions.addTask);

  const tasksAsync = useAsync({
    onSuccess: (data) => {
      setData((data as EditableTLItem[]) ?? []);
    },
    onError: (err) => {
      toastError(err);
    },
  });
  const addTaskAsync = useAsync({
    onSuccess: (data) => {
      setData(prev => [...prev, data as EditableTLItem]);
    },
    onError: (err) => {
      toastError(err);
    },
  });

  const loadTasksTableData = () => {
    tasksAsync.start(fetchTasksList, changeRequest?.id, tasksAsync);
  };

  useEffect(() => {
    loadTasksTableData();
  }, []);

  const formik = useFormik<Partial<EditableTLItem>>({
    initialValues: {},
    onSubmit: (values) => {
      if (isShowOnly) {
        map(values, (value, id) => {
          setData(prev => {
            const tasksListItem = find(prev, { id });
            return [...prev.filter(item => item.id !== id), {
              ...tasksListItem,
              [COMMENTS_FIELD]: { ...tasksListItem?.comments, ...value.comments },
              [ASSIGNEE_ACTIONS_FIELD]: [...(tasksListItem?.assigneeActions ?? []), ...value.assigneeActions],
            }];
          });
        });
      } else {
        if (values[MODE_FIELD] === Mode.add) {
          // ADD API Integration
          const payload = {
            instruction: values?.instructions,
            employeeIds: values?.assignedTo?.map(data => data.value),
            partOf: changeRequest?.id,
          };

          addTaskAsync.start(addTask, payload, addTaskAsync);
        } else {
          // Update API Integration
          setData(prev => {
            return [...prev.filter(item => item.id !== values.id), values];
          });
        }
        discardTLItem();
      }
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedTLItem ?? {} });
  }, [editedTLItem, setValues, resetForm]);

  const createDraftTLItem = () => setEditedTLItem({
    id: uuidv4(),
    number: '1',
    [MODE_FIELD]: Mode.add,
  });

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: editTLItem,
    onConfirm: submitForm,
    onDiscard: discardTLItem,
  });

  const getColumns = () => {
    return schema.filter(({ show }) => show || isShowOnly);
  };

  const rowRender: DataGridProps<TasksListItem>['rowRender'] = (row, { dataItem }) => {
    const item = dataItem as TasksListItem;
    const isUpdating = [Mode.edit, Mode.add].includes(item[MODE_FIELD]);

    if (isShowOnly) {
      return (
        <FormikProvider value={formik}>
          {row}
        </FormikProvider>
      );
    }

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

  const MDItemList = data.reduce<Array<Partial<EditableTLItem>>>((list, item) => {
    const isMDItemEdited = editedTLItem && editedTLItem.id === item.id;

    return [
      ...list,
      {
        ...(isMDItemEdited ? editedTLItem : item),
        [MODE_FIELD]: isMDItemEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isTasksListAdded ? [editedTLItem] : []);

  return (
    <Box className={classes.root} data-cy="tasks-list-table">
      <FBSection label={translate('approvalRequest.tasks.list.section.heading')}>
        {!isShowOnly && <Button
          kind="ghost"
          size="small"
          className={classes.addButton}
          startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
          onClick={() => setShowOnly(true)}
          data-cy="add-link"
        >
          {translate('approvalRequest.tasks.list.add')}
        </Button>}
      </FBSection>
      <KendoDataGrid<EditableTLItem>
        data={MDItemList as EditableTLItem[]}
        schema={getColumns()}
        fullWidth
        className={classes.rootTasksList}
        hasBoxScrollbars
        onRowClick={editTLItem}
        rowRender={rowRender}
      />
      {!isShowOnly && <Button
        kind="add"
        fullWidth
        attached
        onClick={createDraftTLItem}
        data-cy="add-button"
      >
        {translate('approvalRequest.tasks.list.add')}
      </Button>}
    </Box>);
};

export default FBTasksListTable;
