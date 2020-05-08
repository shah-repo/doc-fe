import _ from "lodash";
import * as React from "react";
import { DocumentRevision } from "../../../../state/ducks/documentRevisions";
import { FBSchemaProps, FBWorkspace, FBWorkspaceMode } from "../../../form.builder";
import { DocumentRevisionFormValues } from "../types";

interface Props {
  portalContainer?: Element;
  proposedDocId?: string;
  document?: DocumentRevisionFormValues;
  children?: React.ReactNode | React.ReactNode[];
}

const MemoizedFBWorkspace: React.FunctionComponent<Props> = ({
  portalContainer,
  document,
  ...props
}) => {
  const { group: formGroup } = document?.document?.documentType || {};
  const { docId: outputGroup } = document?.formDocument?.document || {};
  const { schema } = document?.formTemplate || document?.formDocument?.formTemplate || {};
  const { formInput: initialValues } = document || {};
  let mode: Partial<FBWorkspaceMode> = "none";

  if (formGroup && _.includes(formGroup, "FORM")) {
    mode = "design";
  } else if (outputGroup) {
    mode = "form";
  }

  return (
    <FBWorkspace
      {...props}
      schema={schema as FBSchemaProps[]}
      document={document as unknown as DocumentRevision}
      {...{ initialValues, mode, portalContainer }}
    />
  ); };

// document won't be checked because it changes on ever keystroke
// document is passed only the first time
// if this causes any issues we can adjust this to check for document status, outputRevision, etc.
const areEqual = (prevProps: Props, nextProps: Props) => {
  const { id: prevId } = prevProps.document || {};
  const { id: nextId } = nextProps.document || {};
  const { id: prevDocId } = prevProps.document?.document || prevProps.document?.formDocument?.document || {};
  const { id: nextDocId } = nextProps.document?.document || prevProps.document?.formDocument?.document || {};
  return (
    prevId === nextId &&
    prevDocId === nextDocId
    && prevProps.portalContainer === nextProps.portalContainer
    && prevProps.proposedDocId === nextProps.proposedDocId
  );
};

export default React.memo(MemoizedFBWorkspace, areEqual);
