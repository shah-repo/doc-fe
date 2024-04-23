import { cloneDeep } from 'lodash';
import { EditableTLItem } from './types';

export const updateData = (values: Partial<EditableTLItem>, data: EditableTLItem[]): EditableTLItem[] => {
  return cloneDeep(data).map(item => {
    if (item.taskId === values.taskId) {
      return {
        ...item,
        instruction: values.instruction ?? item.instruction,
        employeeResponse: values?.employeeResponse ?? item.employeeResponse,
      };
    }
    return item;
  });
};
