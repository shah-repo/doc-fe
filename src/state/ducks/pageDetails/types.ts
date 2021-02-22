import { ALL_PAGE_DETAILS_FETCHED } from ".";
import { PageDetails } from "../documentRevisions/documentType/types";

export interface PageDetailsState {
  [key: string]: PageDetails;
}

export interface PageDetailsAction {
  type: typeof ALL_PAGE_DETAILS_FETCHED;
  payload: PageDetails[];
}
