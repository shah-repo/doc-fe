import { apiAction } from "../../factories";
import { ApiAction } from "../../types";
import { PageDetails } from "../documentRevisions/documentType/types";
import { ALL_PAGE_DETAILS_FETCHED, PAGE_DETAILS_ROOT_URL } from "./constants";

const allPageDetailsFetched = (pageDetails: PageDetails[]) => ({
  type: ALL_PAGE_DETAILS_FETCHED,
  payload: pageDetails,
});

const allPageDetails = (): ApiAction<PageDetails[]> => apiAction({
  url: PAGE_DETAILS_ROOT_URL,
  method: "get",
  onSuccess: (pageDetails, dispatch) => {
    dispatch(allPageDetailsFetched(pageDetails));
  },
});

export default {
  allPageDetails,
};
