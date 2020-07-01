import * as React from "react";
import OperatorAccess from "./OperatorAccess";
import SecurityEmployees from "./SecurityEmployees";
import SecurityGroups from "./SecurityGroups";

interface Props {
  documentTypeId: string;
}

const DocumentSecurity: React.FunctionComponent<Props> = ({ documentTypeId }) => (
  <>
    <SecurityEmployees />
    <SecurityGroups />
    <OperatorAccess documentTypeId={documentTypeId} />
  </>
);

export default DocumentSecurity;
