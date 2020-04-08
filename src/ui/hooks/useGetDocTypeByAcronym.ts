import { useMemo } from "react";
import { useSelector } from "react-redux";
import { documentTypeSelectors } from "../../state/ducks/documentRevisions/documentType";
import { ApplicationState } from "../../state/reducers";

const useGetDocTypeByAcronym = (
  acronym: string,
) => {
  const selectGetByAcronym = useMemo(() => documentTypeSelectors.makeGetDocTypeByAcronym(), []);
  return useSelector(
    (state: ApplicationState) => selectGetByAcronym(state, acronym)
  );
};

export default useGetDocTypeByAcronym;

