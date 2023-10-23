import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
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
import { ASSIGNEE_ATTACHMENT_FIELD, COMMENTS_FIELD, EmployeeStatus } from './constants';
import { EditableTLItem, EmployeeResponse, TasksListItem, TLItemEditEvent } from './interface';
import { buildSchema } from './schema';
import useStyles from './styles';

interface props {
  changeRequest?: ChangeRequest
  isShowOnly?: boolean
  isApproved?: boolean
}

const FBTasksListTable: React.FunctionComponent<props> = ({ changeRequest, isShowOnly, isApproved }) => {
  const classes = useStyles();
  const [editedTLItem, setEditedTLItem] = React.useState<Partial<EditableTLItem>>();
  const isTasksListAdded = editedTLItem?.[MODE_FIELD] === Mode.add;
  const [data, setData] = React.useState<Array<Partial<EditableTLItem>>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const editTLItem = ({ dataItem }: TLItemEditEvent) => {
    !isShowOnly && setEditedTLItem(dataItem);
  };
  const discardTLItem = () => setEditedTLItem(undefined);
  const fetchTasksList = useActionCreator(taskActions.fetchTasksList);
  // const updateTask = useActionCreator(taskActions.updateTask);
  const addTask = useActionCreator(taskActions.addTask);
  const updateTask = useActionCreator(taskActions.updateTask);
  const deleteTask = useActionCreator(taskActions.deleteTask);

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

  const deleteTaskAsync = useAsync({
    onSuccess: () => {
      loadTasksTableData();
    },
    onError: (err) => {
      toastError(err);
    },
  });

  const updateTaskAsync = useAsync({
    onSuccess: (data) => {
      loadTasksTableData();
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
      if (values[MODE_FIELD] === Mode.add) {
        const payload = {
          instruction: values?.instruction,
          employeeIds: values?.employeeResponse?.map(data => data.employeeId),
          partOf: changeRequest?.id,
        };

        addTaskAsync.start(addTask, payload, addTaskAsync);
      } else {
        const payload = {
          instruction: values?.instruction,
          employeeIds: values?.employeeResponse?.map(data => data.employeeId),
          partOf: changeRequest?.id,
          employeeUpdates: values?.employeeResponse?.map(data => ({
            employeeId: data.employeeId,
          })),
        };
        updateTaskAsync.start(updateTask, changeRequest?.id, values.taskId, payload, updateTaskAsync);
      }
      discardTLItem();
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedTLItem ?? {} });
  }, [editedTLItem, setValues, resetForm]);

  const createDraftTLItem = () => setEditedTLItem({
    taskId: uuidv4(),
    number: '1',
    [MODE_FIELD]: Mode.add,
  });

  const deleteTaskItem = () => {
    const { taskId } = editedTLItem;
    deleteTaskAsync.start(deleteTask, taskId, deleteTaskAsync);
  };

  const employeeCommentUpdates = (taskId: string, employeeResponse: EmployeeResponse[]) => {
    const { values } = formik;
    const payload = {
      employeeUpdates: employeeResponse?.map(data => ({
        employeeId: data.employeeId,
        comment: values?.[COMMENTS_FIELD]?.[data?.employeeId],
      })),
    };
    updateTaskAsync.start(updateTask, changeRequest?.id, taskId, payload, updateTaskAsync);
  };

  const employeeStatusUpdates = (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => {
    const { values } = formik;
    const payload = {
      employeeUpdates: employeeResponse?.map(data => {
        if (data.employeeId !== employeeId) {
          return {
            employeeId: data.employeeId,
            status: data.status,
            attachmentId: data.attachmentId,
          };
        }
        return {
          employeeId: data.employeeId,
          status: employeeId === data.employeeId ? EmployeeStatus.Done : data.status,
          attachmentId: data.attachmentId ?? values?.[ASSIGNEE_ATTACHMENT_FIELD]?.[data.employeeId]?.[0]?.id,
        };
      }),
    };
    updateTaskAsync.start(updateTask, changeRequest?.id, taskId, payload, updateTaskAsync);
  };

  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: editTLItem,
    onConfirm: submitForm,
    onDiscard: discardTLItem,
    onDelete: deleteTaskItem,
    employeeCommentUpdates: employeeCommentUpdates,
    employeeStatusUpdates: employeeStatusUpdates,
  });

  const getColumns = () => {
    return schema.filter(({ show }) => show || isApproved);
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

  const MDItemList = data.reduce<Array<Partial<EditableTLItem>>>((list, item, index) => {
    const isMDItemEdited = editedTLItem && editedTLItem.taskId === item.taskId;

    return [
      ...list,
      {
        ...(isMDItemEdited ? { ...editedTLItem, number: `${index + 1}` } : { ...item, number: `${index + 1}` }),
        [MODE_FIELD]: isMDItemEdited ? Mode.edit : Mode.show,
      },
    ];
  }, isTasksListAdded ? [editedTLItem] : []);

  return (
    <Box ref={containerRef} className={classes.root} data-cy="tasks-list-table">
      <FBSection label={translate('approvalRequest.tasks.list.section.heading')}>
        <Button
          kind="ghost"
          size="small"
          className={classes.addButton}
          startIcon={<FontAwesomeIcon icon={solid('circle-plus')} />}
          onClick={createDraftTLItem}
          data-cy="add-task-small-btn"
          disabled={isShowOnly}
        >
          {translate('approvalRequest.tasks.list.add')}
        </Button>
      </FBSection>
      <KendoDataGrid<EditableTLItem>
        data={MDItemList as EditableTLItem[]}
        schema={getColumns()}
        fullWidth
        className={classes.rootTasksList}
        hasBoxScrollbars
        onRowClick={editTLItem}
        loading={addTaskAsync.isLoading || deleteTaskAsync.isLoading || updateTaskAsync.isLoading}
        rowRender={rowRender}
        containerRef={containerRef}
      />
      {!isShowOnly && <Button
        kind="add"
        fullWidth
        attached
        onClick={createDraftTLItem}
        data-cy="add-task"
      >
        {translate('approvalRequest.tasks.list.add')}
      </Button>}
    </Box>);
};

export default FBTasksListTable;
