import _ from "lodash";
import { store } from "react-easy-state";
import { view } from "react-easy-state";
import { FBBasicFieldEditorType } from "../main/editor/utils/types";
import { FBTemplateStore } from "./utils/types";

const templateStore: FBTemplateStore = store({
  name: null,
  documentType: null,
  schema: [],

  setState: (values: FBTemplateStore) => _.merge(templateStore, values),

  namePrefix: () => `${templateStore.schema.length}_${(templateStore.name || "").replace(" ", "")}`,

  generateSchemaEl: (type: FBBasicFieldEditorType, values: any) => ({
    type,
    name: `${templateStore.namePrefix()}_text_field`,
    label: values[`${templateStore.namePrefix()}_label_field`],
    placeholder: values[`${templateStore.namePrefix()}_placeholder_field`],
    rows: values[`${templateStore.namePrefix()}_rows_field`],
  }),
});

export {
  view,
  templateStore,
};
