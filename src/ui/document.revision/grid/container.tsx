import React from "react";
import { RouteComponentProps } from "react-router-dom";
import DocumentListPresenter from "./presenter";

const DocumentListContainer: React.FunctionComponent<RouteComponentProps> = () => {
  console.log("debug :: DocumentListContainer");
  return (
    <DocumentListPresenter />
  );
};

export default DocumentListContainer;
