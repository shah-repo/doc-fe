import * as React from "react";
import OperatorAccess from "./OperatorAccess";
import SecurityEmployees from "./SecurityEmployees";
import SecurityGroups from "./SecurityGroups";

const DocumentSecurity: React.FunctionComponent = () => (
  <>
    <SecurityEmployees />
    <SecurityGroups />
    <OperatorAccess />
  </>
);

export default DocumentSecurity;
