import { DataProps } from "../../../state/ducks/common/types";
import { DocumentRevisionStatus, Reference as Model } from "../../../state/ducks/documentRevisions/types";

interface OwnProps {
  status: DocumentRevisionStatus;
  deprecatedAt?: string;
}

export type Props = OwnProps & DataProps<Model[]>;
