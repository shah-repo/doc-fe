import {
  ADD_FIELD,
  ADD_LIST,
  CLOSE_SECTION,
  DELETE_FIELD,
  EDIT_FIELD,
  HIDE_MODAL,
  RECORD_UPDATES,
  SET_FORM_INFO,
  SHOW_MODAL,
  UPDATE_DRAG_DROP_FIELDS,
  UPDATE_FIELD,
  UPDATE_FIELD_VALUE,
  UPLOAD_TEMPLATE,
  VIEW_FORM_MODE,
} from "./constants";

export const viewFormMode = (mode: boolean) => ({
  type: VIEW_FORM_MODE,
  mode,
});

export const showModal = (currentIndex: number | string) => ({
  type: SHOW_MODAL,
  currentIndex,
});

export const hideModal = () => ({
  type: HIDE_MODAL,
});

export const addField = (field: any) => ({
  type: ADD_FIELD,
  field,
});

export const addList = (fieldType: string) => ({
  type: ADD_LIST,
  fieldType,
});

export const editField = (
  fieldType: string,
  config: any,
  currentIndex: number | string,
  closed: boolean,
) => ({
  type: EDIT_FIELD,
  fieldType,
  config,
  currentIndex,
  closed,
});

export const updateField = (
  fieldType: string,
  config: any,
  currentIndex: number | string,
  closed: boolean,
) => ({
  type: UPDATE_FIELD,
  fieldType,
  config,
  currentIndex,
  closed,
});

export const deleteField = (currentIndex: number | string) => ({
  type: DELETE_FIELD,
  currentIndex,
});

export const closeSection = (currentIndex: number | string) => ({
  type: CLOSE_SECTION,
  currentIndex,
});

export const recordUpdates = (
  prevConfig: any,
  newConfig: any,
  currentIndex: number | string,
  reason: string,
) => {
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return {
    type: RECORD_UPDATES,
    prevConfig,
    newConfig,
    date,
    time,
    currentIndex,
    reason,
  };
};

export const uploadTemplate = (elements: any) => ({
  type: UPLOAD_TEMPLATE,
  elements,
});

export const setFormInfo = (
  title: string,
  formNumber: number,
  status: string,
) => ({
  type: SET_FORM_INFO,
  title,
  formNumber,
  status,
});

export const updateDragAndDropFields = (fields: any) => ({
  type: UPDATE_DRAG_DROP_FIELDS,
  fields,
});

export const updateFieldValue = (
  currentIndex: number | string,
  fieldName: string,
  fieldValue: any,
) => ({
  type: UPDATE_FIELD_VALUE,
  currentIndex,
  fieldName,
  fieldValue,
});

export default {
  viewFormMode,
  showModal,
  hideModal,
  addField,
  addList,
  editField,
  updateField,
  deleteField,
  closeSection,
  recordUpdates,
  updateFieldValue,
  setFormInfo,
  uploadTemplate,
  updateDragAndDropFields,
};
