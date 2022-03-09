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
}) => (
  <References
    owner={owner}
    status={status}
    referencedBy={referencedBy}
    deprecatedAt={deprecatedAt}
    referenceTo={referenceTo}
    released={released}
    formDocument={formDocument}
  />
);

export default ReferencesPresenter;
