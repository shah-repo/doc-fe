import { FormikContextType } from "formik";
import { get } from "lodash";
import { DocumentRevision } from "../../../state/ducks/documentRevisions/types";
import { toNewVersionRequestBody } from "../../documentRevision/forms/transform";
import { DocumentRevisionFormValues } from "../../documentRevision/forms/types";
import { generateRevisionNumber } from "../../documentRevision/helpers/generateRevisionNumber";
import FBDataStore from "../FBStore/FBDataStore";

export const generateDocIdLabel = (docRev?: DocumentRevision) => {
  if (!docRev) {
    return "N/A";
  }
  const { document: { docId } } = docRev;
  return `${docId} - ${docIdVersion(docRev)}`;
};

const docIdVersion = (docRev: DocumentRevision) => {
  const { revision, subRevision, revisionStage, revisionChangeType } = docRev;
  return generateRevisionNumber(revision, revisionStage, subRevision, revisionChangeType);
};


export const createNewDocRev = (formik: FormikContextType<unknown>, workspaceState, async, createDocAction) => {
  const values = get(formik, "values") as DocumentRevisionFormValues;
  values.formDocument = { id: workspaceState?.document?.formDocument?.id };
  const promise = async.start(createDocAction, toNewVersionRequestBody(values), async);
      promise?.then(() => {
        FBDataStore?.setRefreshData({
          ...values,
        });
      });
};
