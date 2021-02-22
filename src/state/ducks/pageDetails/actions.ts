import { ALL_PAGE_DETAILS_FETCHED, PAGE_DETAILS_ROOT_URL } from ".";
import { apiAction, apiActionWithCallbacks } from "../../factories";
import { ApiAction, Handlers } from "../../types";
import { PageDetails } from "../documentRevisions/documentType/types";

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

const updatePageDetails = (
  id: string,
  body: PageDetails,
  handlers: Handlers,
): ApiAction<PageDetails> => apiActionWithCallbacks({
  url: `${PAGE_DETAILS_ROOT_URL}/${id}`,
  method: "patch",
  data: body,
  onSuccess: (pageDetails, dispatch) => {
    dispatch(allPageDetails());
  },
  handlers,
});

const deletePageDetails = (id: string): ApiAction<PageDetails[]> => apiAction({
  url: `${PAGE_DETAILS_ROOT_URL}/${id}`,
  method: "delete",
  onSuccess: (m, dispatch) => {
    dispatch(allPageDetails());
  },
});

const addPageDetails = (
  body: PageDetails,
  handlers: Handlers,
): ApiAction<PageDetails[]> => apiActionWithCallbacks({
  url: PAGE_DETAILS_ROOT_URL,
  method: "post",
  data: body,
  onSuccess: (m, dispatch) => {
    dispatch(allPageDetails());
  },
  handlers,
});

export default {
  allPageDetails,
  updatePageDetails,
  deletePageDetails,
  addPageDetails,
};
