import React from "react";
import References from "./References";

const ReferencesPresenter = ({
  owner,
  status,
  referencedBy,
  deprecatedAt,
  referenceTo,
  released,
  formDocument,
  retrain,
  selectedDocument,
  edit,
}) => (
  <References
    owner={owner}
    status={status}
    referencedBy={referencedBy}
    deprecatedAt={deprecatedAt}
    referenceTo={referenceTo}
    released={released}
    formDocument={formDocument}
    retrain={retrain}
    selectedDocument={selectedDocument}
    edit={edit}
  />
);

export default ReferencesPresenter;
