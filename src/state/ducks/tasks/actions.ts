import { TasksListEditRequestBody, TasksListItem } from '../../../ui/change.request/FBMaterialDisposition/components/FBTasksListTable/types';
import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { DOCUMENT_REVISION_ROOT_URL } from '../documentRevisions/constants';
import { CLOSE_WO, COMPLETE_WO, FETCH_ALL_TASKS_LIST, FETCH_PENDING_TASKS_COUNT, TASKS_LIST } from './constants';

const fetchTasksList = (arId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${FETCH_ALL_TASKS_LIST}/${arId}`,
    method: 'get',
    handlers,
  });

const addTask = (data: TasksListEditRequestBody, handlers: Handlers): ApiAction<TasksListItem, TasksListEditRequestBody> =>
  apiActionWithCallbacks({
    url: TASKS_LIST,
    method: 'post',
    data,
    handlers,
  });

const updateTask = (
  arId: string,
  taskId: string,
  data: TasksListEditRequestBody,
  handlers: Handlers,
): ApiAction<TasksListItem, TasksListEditRequestBody> =>
  apiActionWithCallbacks({
    url: `${TASKS_LIST}/${arId}/${taskId}`,
    method: 'patch',
    data,
    handlers,
  });

const deleteTask = (taskId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${TASKS_LIST}/${taskId}`,
    method: 'delete',
    handlers,
  });

const fetchTask = (id: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${TASKS_LIST}/${id}`,
    method: 'get',
    handlers,
  });

const UpdateEmployeeDetails = (
  arId: string,
  taskId: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${TASKS_LIST}/${arId}/${taskId}`,
    method: 'patch',
    handlers,
  });

const getPendingTasksCount = (
  arId: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${FETCH_PENDING_TASKS_COUNT}/${arId}`,
    method: 'get',
    handlers,
  });

const closeWO = (
  woId: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${CLOSE_WO}/${woId}`,
    method: 'post',
    handlers,
  });

const completeWO = (
  woId: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${COMPLETE_WO}/${woId}`,
    method: 'post',
    handlers,
  });

const getDocById = (
  DocRevId: string,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${DOCUMENT_REVISION_ROOT_URL}/${DocRevId}`,
    method: 'get',
    handlers,
  });

export default {
  fetchTasksList,
  fetchTask,
  addTask,
  updateTask,
  UpdateEmployeeDetails,
  getPendingTasksCount,
  deleteTask,
  closeWO,
  completeWO,
  getDocById,
};
