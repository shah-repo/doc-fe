import { PageDetails } from "../documentRevisions/documentType/types";
import { PAGE_DETAILS_SET } from "./constants";

export type PageDetailsState = PageDetails;

export interface PageDetailsAction {
  type: typeof PAGE_DETAILS_SET;
  payload: {
    pageDetails: PageDetails;
  };
}
