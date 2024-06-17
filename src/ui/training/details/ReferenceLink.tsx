import React from 'react';
import { Link } from 'react-router-dom';
import { documentVersionPath } from '../../document.revision/utils/paths';

interface ReferenceLinkProps {
  label: string
  documentId?: string
  revisionId?: string
  className?: string
}

const ReferenceLink: React.FC<ReferenceLinkProps> = (props) => {
  const { label, documentId, revisionId, className } = props;

  if (!documentId || !revisionId) {
    return <>{label}</>;
  }

  const url = documentVersionPath(revisionId, documentId);

  return (
    <Link
      className={className}
      to={url}
    >
      {label}
    </Link>
  );
};

export default ReferenceLink;
