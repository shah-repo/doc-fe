import React from "react";
import { withFBStore } from "../../form.builder/hocs/withFBStore";
import FBWorkspace from "../../form.builder/main/workspace/FBWorkspace";
import { FBStoreProps } from "../../form.builder/types/store";

interface FBDocumentRevisionProps extends FBStoreProps {
  docId?: string;
}

const FBDocumentRevision: React.FunctionComponent<FBDocumentRevisionProps> = ({
  formBuilderStore,
  docId,
}) => {

  return <FBWorkspace />;
};

export default withFBStore(FBDocumentRevision);
