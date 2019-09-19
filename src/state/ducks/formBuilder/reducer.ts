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

const initialState = {
  title: "",
  formNumber: "",
  status: "",
  elements: [],
  modalState: {},
  currentField: "",
  tasks: [],
  viewFormMode: false,
};

const formReducer = (state: any = initialState, action: any) => {
  const elements = [...state.elements];
  const index = state.currentIndex;
  const newTasks = [...state.tasks];
  switch (action.type) {
    case VIEW_FORM_MODE:
      return {
        ...state,
        viewFormMode: action.mode,
      };
    case ADD_FIELD:
      elements.splice(index + 1, 0, action.field);
      return {
        ...state,
        elements,
        modalState: { ...state.modalState, show: false },
      };
    case ADD_LIST:
      const listField = {
        type: action.fieldType,
        config: {
          colWidth: "col-6",
          title: action.fieldType,
        },
      };
      elements.splice(index + 1, 0, listField);
      return {
        ...state,
        elements,
        modalState: { ...state.modalState, show: false },
      };
    case SHOW_MODAL:
      return {
        ...state,
        modalState: { ...state.modalState, show: true },
        currentIndex: action.currentIndex,
      };
    case HIDE_MODAL:
      return {
        ...state,
        modalState: { ...state.modalState, show: false },
        currentField: "",
      };

    case EDIT_FIELD:
      return {
        ...state,
        elements,
        modalState: { ...state.modalState, show: true },
        currentField: {
          currentIndex: action.currentIndex,
          type: action.fieldType,
          config: action.config,
          closed: action.closed,
        },
      };

    case UPDATE_FIELD:
      const updatedField = {
        type: action.fieldType,
        config: action.config,
        order: action.currentIndex,
        closed: action.closed,
      };
      elements.splice(action.currentIndex, 1, updatedField);
      return {
        ...state,
        elements,
        modalState: { ...state.modalState, show: false },
        currentField: "",
      };
    case RECORD_UPDATES:
      const diff = {
        reason: action.reason,
        date: action.date,
        time: action.time,
        changes: [action.prevConfig, action.newConfig],
      };
      elements[
        elements.findIndex(
          (item, i) => i >= index && item.type === "closeSection",
        )
      ].diff.push(diff);
      return {
        ...state,
        elements,
      };
    case DELETE_FIELD:
      elements.splice(action.currentIndex, 1);
      return {
        ...state,
        elements,
      };

    case CLOSE_SECTION:
      let flag = false;
      elements.reduceRight((acc, elem, i) => {
        if (i <= index + 1 && !flag) {
          elem.closed = true;
          if (elem.type === "section") {
            flag = true;
          }
        }
        return elem;
      }, []);
      return {
        ...state,
        elements,
      };

    case SET_FORM_INFO:
      return {
        ...state,
        title: action.title,
        formNumber: action.formNumber,
        status: action.status,
      };

    case UPLOAD_TEMPLATE:
      return {
        ...state,
        elements: action.elements,
      };

    case UPDATE_DRAG_DROP_FIELDS:
      return {
        ...state,
        elements: action.fields,
      };

    case UPDATE_FIELD_VALUE:
      return {
        ...state,
        elements: state.elements.map((element: any, i: any) => {
          if (action.currentIndex === i) {
            return {
              ...element,
              values: {
                ...element.values,
                [action.fieldName]: action.fieldValue,
              },
            };
          }
          return element;
        }),
      };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case "EDIT_TASK":
      newTasks.splice(action.id, 1, action.task);
      return { ...state, tasks: [...state.tasks] };
    case "DELETE_TASK":
      newTasks.splice(action.id, 1);
      return { ...state, tasks: [...newTasks] };
    case "CLOSE_TASK":
      const task = newTasks[action.id];
      task.status = "closed";
      newTasks.splice(action.id, 1, task);
      return { ...state, tasks: [...newTasks] };
    default:
      return state;
  }
};

export default formReducer;
export type formReducerType = ReturnType<typeof formReducer>;
