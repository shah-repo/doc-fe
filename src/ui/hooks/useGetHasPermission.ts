import { useMemo } from "react";
import { useSelector } from "react-redux";
import { authSelectors, Permission } from "../../state/ducks/auth";
import { ApplicationState } from "../../state/reducers";

const useGetHasPermission = (
  permission: Permission,
) => {
  const selectGetHasPermission = useMemo(() => authSelectors.makeGetHasPermission(), []);
  return useSelector(
    (state: ApplicationState) => selectGetHasPermission(state, permission)
  );
};

export default useGetHasPermission;

