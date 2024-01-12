import { solid } from '@fortawesome/fontawesome-svg-core/import.macro';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box } from '@material-ui/core';
import cx from 'classnames';
import { FormikProvider, useFormik, useFormikContext } from 'formik';
import { debounce, isEmpty } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { translate } from '../../../../../common/intl';
import { Attachment } from '../../../../../state/ducks/attachments/types';
import { ChangeRequestStatus } from '../../../../../state/ducks/changeRequest/types';
import { DocumentRevisionStatus } from '../../../../../state/ducks/documentRevisions/types';
import { taskActions } from '../../../../../state/ducks/tasks';
import { Button } from '../../../../components/forms/fields-next';
import { useFormContext } from '../../../../components/forms/FormContext';
import { Mode, MODE_FIELD } from '../../../../components/KendoDataGrid/constants';
import KendoDataGrid from '../../../../components/KendoDataGrid/KendoDataGrid';
import { DataGridProps } from '../../../../components/KendoDataGrid/KendoDataGrid.types';
import { toastError } from '../../../../components/notifications';
import { checkIsDocumentWO, checkIsTypeHaveOutput } from '../../../../documentRevision/helpers/checkDocumentGroup';
import { FB, FBSection } from '../../../../form.builder';
import useActionCreator from '../../../../hooks/useActionCreator';
import useAsync from '../../../../hooks/useAsync';
import { changeRequestPreviewPath } from '../../../utils/paths';
import { COMMENTS_FIELD, EmployeeStatus } from './constants';
import { buildSchema } from './schema';
import useStyles from './styles';
import { EditableTLItem, EmployeeResponse, TasksListItem, TLItemEditEvent } from './types';

interface props {
  partOfId: string
  state: ChangeRequestStatus | DocumentRevisionStatus
  isShowOnly?: boolean
  disabled?: boolean
  isAdditionalColumnsShown?: boolean
  setDoNotPrompt?: (state: boolean) => void
}

const FBTasksListTable: React.FunctionComponent<props> = (
  { partOfId, state, isShowOnly = false, isAdditionalColumnsShown, setDoNotPrompt, disabled }) => {
  const classes = useStyles();
  isShowOnly = (isShowOnly || disabled) ?? false;
  const [partOfIdToUse, setPartOfIdToUse] = useState(partOfId);
  const [editedTLItem, setEditedTLItem] = React.useState<Partial<EditableTLItem>>();
  const isEditMode = React.useRef<boolean>(false);
  const isTasksListAdded = editedTLItem?.[MODE_FIELD] === Mode.add;
  const increasedBy = isTasksListAdded ? 2 : 1;
  const [data, setData] = React.useState<Array<Partial<EditableTLItem>>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const editTLItem = ({ dataItem }: TLItemEditEvent) => {
    !isShowOnly && !isEditMode.current && !formik.dirty && setEditedTLItem(dataItem);
  };
  const discardTLItem = () => setEditedTLItem(undefined);
  const fetchTasksList = useActionCreator(taskActions.fetchTasksList);
  const addTask = useActionCreator(taskActions.addTask);
  const updateTask = useActionCreator(taskActions.updateTask);
  const deleteTask = useActionCreator(taskActions.deleteTask);
  const formContext = useFormContext();
  const parentFormik = useFormikContext();
  const [dataToSubmit, setDataToSubmit] = React.useState<Partial<EditableTLItem>>({});
  const history = useHistory();
  const { workspaceState } = FB.useStores();
  const groupOptions = workspaceState?.document?.document?.documentType?.groupOptions;
  const isWORecord = checkIsDocumentWO(groupOptions) && !checkIsTypeHaveOutput(groupOptions);
  const enbleTasksAdditionalColumns = isWORecord && DocumentRevisionStatus.Draft !== workspaceState?.document?.status;

  if (enbleTasksAdditionalColumns) {
    isAdditionalColumnsShown = true;
  }

  const loadTasksTableData = () => {
    tasksAsync.start(fetchTasksList, partOfIdToUse, tasksAsync);
  };

  const tasksAsync = useAsync({
    onSuccess: (data) => {
      setData((data as EditableTLItem[]) ?? []);
    },
    onError: toastError,
  });
  const addTaskAsync = useAsync({
    onSuccess: (data) => {
      setData(prev => [...prev, data as EditableTLItem]);
    },
    onError: toastError,
  });

  const deleteTaskAsync = useAsync({
    onSuccess: loadTasksTableData,
    onError: toastError,
  });

  const updateTaskAsync = useAsync({
    onSuccess: () => {
      loadTasksTableData();
      if (formContext.isEditing) {
        history.push(changeRequestPreviewPath(partOfId ?? ''));
      }
    },
    onError: toastError,
  });

  useEffect(() => {
    if (workspaceState?.id && !partOfId) {
      setPartOfIdToUse(workspaceState.id);
    }
  }, [workspaceState?.id, partOfId]);

  useEffect(() => {
    if (partOfIdToUse) {
      loadTasksTableData();
    }
  }, [partOfIdToUse]);

  const formik = useFormik<Partial<EditableTLItem>>({
    initialValues: {},
    onSubmit: (values) => {
      if (values[MODE_FIELD] === Mode.add) {
        const payload = {
          instruction: values?.instruction,
          employeeIds: values?.employeeResponse?.map(data => data.employeeId),
          partOfId: partOfIdToUse,
        };

        addTaskAsync.start(addTask, payload, addTaskAsync);
      } else {
        if (formContext.isEditing) {
          isEditMode.current = true;
          setDataToSubmit(values);
          setData(prev => {
            return prev.map(item => {
              if (item.taskId === values.taskId) {
                return {
                  ...item,
                  instruction: values.instruction ?? item.instruction,
                  employeeResponse: values?.employeeResponse ?? item.employeeResponse,
                };
              }
              return item;
            });
          });
        } else {
          updateTaskItem(values);
        }
      }
      discardTLItem();
    },
  });

  const { submitForm, resetForm, setValues } = formik;

  useEffect(() => {
    resetForm({ values: editedTLItem ?? {} });
  }, [editedTLItem, setValues, resetForm]);

  useEffect(() => {
    if (formContext.isEditing && parentFormik?.isSubmitting && !isEmpty(dataToSubmit)) {
      setDoNotPrompt?.(true);
      updateTaskItem(dataToSubmit);
    }
  }, [parentFormik?.isSubmitting]);

  const createDraftTLItem = () => setEditedTLItem({
    taskId: uuidv4(),
    number: '1',
    [MODE_FIELD]: Mode.add,
  });

  const updateTaskItem = (values: Partial<EditableTLItem>) => {
    const payload = {
      instruction: values?.instruction,
      employeeIds: values?.employeeResponse?.map(data => data.employeeId),
      partOfId: partOfIdToUse,
      employeeUpdates: values?.employeeResponse?.map(data => ({
        employeeId: data.employeeId,
      })),
    };

    updateTaskAsync.start(updateTask, partOfIdToUse, values.taskId, payload, updateTaskAsync);
  };

  const deleteTaskItem = () => {
    if (!editedTLItem?.taskId) {
      return;
    }
    deleteTaskAsync.start(deleteTask, editedTLItem?.taskId, deleteTaskAsync);
  };

  const employeeStatusUpdates = (taskId: string, employeeResponse: EmployeeResponse[], employeeId: string) => {
    const { values } = formik;
    const payload = {
      employeeUpdates: employeeResponse?.map(data => {
        if (data.employeeId !== employeeId) {
          return {
            employeeId: data.employeeId,
            status: data.status,
            attachments: data.attachments,
            comment: data.comment,
          };
        }
        return {
          employeeId: data.employeeId,
          status: employeeId === data.employeeId ? EmployeeStatus.Done : data.status,
          attachments: data.attachments,
          comment: values?.[taskId]?.[COMMENTS_FIELD]?.[employeeId] ?? data?.comment,
        };
      }),
    };
    updateTaskAsync.start(updateTask, partOfIdToUse, taskId, payload, updateTaskAsync);
  };

  const employeeEvidenceUpdates = (dataItem: TasksListItem, employeeId: string, attachments: Attachment[]) => {
    const { taskId, employeeResponse } = dataItem;
    const payload = {
      employeeUpdates: employeeResponse?.map(data => {
        if (data.employeeId !== employeeId) {
          return {
            employeeId: data.employeeId,
            status: data.status,
            attachments: data.attachments,
          };
        }
        return {
          employeeId: data.employeeId,
          status: data.status,
          attachments,
        };
      }),
    };
    updateTaskAsync.start(updateTask, partOfIdToUse, taskId, payload, updateTaskAsync);
  };

  const debounceEmployeeEvidenceUpdates = debounce(employeeEvidenceUpdates, 1000);
  const isWOReleased = isWORecord && DocumentRevisionStatus.Released === workspaceState?.document?.status;
  const isClosed = isWORecord ? isWOReleased : (state === ChangeRequestStatus.Closed || state === DocumentRevisionStatus.Released);
  const schema = buildSchema({
    actionsClass: classes.actionsCell,
    onRowClick: editTLItem,
    onConfirm: submitForm,
    onDiscard: discardTLItem,
    onDelete: deleteTaskItem,
    employeeStatusUpdates: employeeStatusUpdates,
    employeeEvidenceUpdates: debounceEmployeeEvidenceUpdates,
    isDisabled: isWORecord ? isWOReleased : ChangeRequestStatus.Closed === state,
    isClosed,
  });

  const getColumns = () => {
    return schema.filter(({ show }) => show || isAdditionalColumnsShown);
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
    const number = `${index + increasedBy}`;
    return [
      ...list,
      {
        ...(isMDItemEdited ? { ...editedTLItem, number } : { ...item, number }),
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
          disabled={isShowOnly || formContext.isEditing}
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
        loading={tasksAsync.isLoading || addTaskAsync.isLoading || deleteTaskAsync.isLoading || updateTaskAsync.isLoading}
        rowRender={rowRender}
        containerRef={containerRef}
        resizable={true}
      />
      {!isShowOnly && !formContext.isEditing && <Button
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
