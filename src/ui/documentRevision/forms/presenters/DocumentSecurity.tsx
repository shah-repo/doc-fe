import * as React from "react";
import OperatorAccess from "./OperatorAccess";
import SecurityEmployees from "./SecurityEmployees";
import SecurityGroups from "./SecurityGroups";

interface Props {
  documentTypeId: string;
  isDisabled?: boolean;
}

const DocumentSecurity: React.FunctionComponent<Props> = ({ documentTypeId, isDisabled }) => (
  <>
    <SecurityEmployees portal={true} isDisabled={isDisabled} />
    <SecurityGroups portal={true} isDisabled={isDisabled} />
    <OperatorAccess documentTypeId={documentTypeId} isDisabled={isDisabled} />
  </>
);

export default DocumentSecurity;
