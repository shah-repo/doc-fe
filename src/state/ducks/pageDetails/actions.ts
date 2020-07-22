import { apiAction } from "../../factories";
import { ApiAction } from "../../types";
import { PageDetails } from "../documentRevisions/documentType/types";
import { PAGE_DETAILS_ROOT_URL, PAGE_DETAILS_SET } from "./constants";

const pageDetailsSet = (pageDetails: PageDetails[]) => ({
  type: PAGE_DETAILS_SET,
  payload: pageDetails,
});

const categoryPageDetails = (category: string): ApiAction<PageDetails[]> => apiAction({
  url: PAGE_DETAILS_ROOT_URL,
  method: "get",
  params: {
    category,
  },
  onSuccess: (pageDetails, dispatch) => {
    dispatch(pageDetailsSet(pageDetails));
  },
});

export default {
  categoryPageDetails,
};
