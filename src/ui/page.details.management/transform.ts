import { PageDetails } from "../../state/ducks/documentRevisions/documentType/types";
import { parseJSON, stringifyJSON } from "../document.type.management/transform";
import { PageDetailsCategory, PageDetailsCategoryValues } from "./types";

export const toPageDetailsInitialValues = (pageDetails: PageDetails): PageDetailsCategoryValues => ({
  ...pageDetails,
  columns: stringifyJSON(pageDetails.columns),
  config: stringifyJSON(pageDetails.config),
  helpModule: pageDetails.config.helpModule,
});

export const toPageDetailsBodyValues = (values: PageDetailsCategoryValues): PageDetailsCategory => ({
  category: values.category,
  addNewBtnLabel: values.addNewBtnLabel,
  columns: parseJSON(values.columns),
  config: {
    ...parseJSON(values.config),
    helpModule: values.helpModule,
  },
});

