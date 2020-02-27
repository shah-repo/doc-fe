import { useMemo } from "react";
import { useSelector } from "react-redux";
import { authSelectors } from "../../state/ducks/auth";
import { GroupTag } from "../../state/ducks/auth/types";
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

