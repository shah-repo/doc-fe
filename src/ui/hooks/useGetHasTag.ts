import { useMemo } from "react";
import { useSelector } from "react-redux";
import { authSelectors, GroupTag } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";

const useGetHasTag = (
  tag: GroupTag,
) => {
  const selectGetHasTag = useMemo(() => authSelectors.makeGetHasTag(), []);
  return useSelector(
    (state: ApplicationState) => selectGetHasTag(state, tag)
  );
};

export default useGetHasTag;

