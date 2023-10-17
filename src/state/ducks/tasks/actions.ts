import { apiActionWithCallbacks } from '../../factories';
import { ApiAction, Handlers } from '../../types';
import { FETCH_ALL_TASKS_LIST, TASKS_LIST } from './constants';

const fetchTasksList = (arId: string, handlers: Handlers): ApiAction =>
  apiActionWithCallbacks({
    url: `${FETCH_ALL_TASKS_LIST}/${arId}`,
    method: 'get',
    handlers,
  });

const addTask = (data, handlers: Handlers): ApiAction<EditableTLItem> =>
  apiActionWithCallbacks({
    url: `${TASKS_LIST}`,
    method: 'post',
    data: { ...data },
    handlers,
  });

const updateTask = (
  arId: string,
  taskId: string,
  data,
  handlers: Handlers,
): ApiAction =>
  apiActionWithCallbacks({
    url: `${TASKS_LIST}/${arId}/${taskId}`,
    method: 'patch',
    data: { ...data },
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

export default {
  fetchTasksList,
  fetchTask,
  addTask,
  updateTask,
  UpdateEmployeeDetails,
  deleteTask,
};
