import { TableSearchQueryProps } from "./types";

export const searchQueryString = ({ query, searchValueGetter }: TableSearchQueryProps) => {
  let queryValue = query.toString();
  if (searchValueGetter) {
    queryValue = searchValueGetter(queryValue).toString();
  }
  return queryValue;
};
