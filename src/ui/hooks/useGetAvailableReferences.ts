import { useMemo } from "react";
import { useSelector } from "react-redux";
import { documentRevisionsSelectors } from "../../state/ducks/documentRevisions";
import { ApplicationState } from "../../state/reducers";
import { DocumentRevisionFormValues } from "../documentRevision/forms/types";

const useGetAvailableReferences = (
  initialValues: DocumentRevisionFormValues,
) => {
  const selectGetAvailableReferences = useMemo(() => documentRevisionsSelectors.makeGetAvailableReferences(), []);
  return useSelector(
    (state: ApplicationState) => selectGetAvailableReferences(state, initialValues)
  );
};

export default useGetAvailableReferences;

