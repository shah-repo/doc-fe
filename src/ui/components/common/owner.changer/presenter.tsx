import { Button } from "@material-ui/core";
import React from "react";

export interface OwnProps {
  queryEmployees: any;
}

const OwnerChangerPresenter: React.FC<OwnProps> = ({ queryEmployees }) => {

  return (<Button onClick={queryEmployees}>Change Owner</Button>);
};

export default OwnerChangerPresenter;
