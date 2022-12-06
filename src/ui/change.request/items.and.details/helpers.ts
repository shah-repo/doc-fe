export const generateDocTitleText = (docId: string, displayRevision: string, name: string) => (
  `${docId} # rev ${displayRevision} - ${name}`
);
