import React from "react";
import References from "./References";
import { ReferencesProps } from "./types";

const ReferencesPresenter = ({
  selectedDocument,
  edit,
}: ReferencesProps) => (
  <References
    selectedDocument={selectedDocument}
    edit={edit}
  />
);

export default ReferencesPresenter;
