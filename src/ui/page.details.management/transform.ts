import { PageDetails } from "../../state/ducks/documentRevisions/documentType/types";
import { parseJSON, stringifyJSON } from "../document.type.management/transform";

export const toPageDetailsInitialValues = (pageDetails: PageDetails) => ({
  ...pageDetails,
  columns: stringifyJSON(pageDetails.columns),
});

export const toPageDetailsBodyValues = (values) => ({
  category: values.category,
  addNewBtnLabel: values.addNewBtnLabel,
  columns: parseJSON(values.columns),
});

