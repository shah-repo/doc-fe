import { PageDetails } from "../../state/ducks/documentRevisions/documentType";
import { parseJSON, stringifyJSON } from "../document.type.management/transform";

export const toPageDetailsIntialValues = (pageDetails: PageDetails) => ({
  category: pageDetails.category,
  addNewBtnLabel: pageDetails.addNewBtnLabel,
  columns: stringifyJSON(pageDetails.columns),
});

export const toPageDetailsBodyValues = (values) => ({
  category: values.category,
  addNewBtnLabel: values.addNewBtnLabel,
  columns: parseJSON(values.columns),
});

