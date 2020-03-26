import { Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { DocumentRevisionDocument } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import { getReferencedBySummary } from "../../../document.revision/utils/references.helpers";

export interface Props {
  document?: Partial<DocumentRevisionDocument>;
}

export const References: React.FunctionComponent<Props> = ({
  document,
}) => {
  const refSummary = useMemo(() => getReferencedBySummary(document?.referencedBy || []), [document]);

  if (document?.referencedBy?.length === 0) {
    return null;
  }

  return (
    <React.Fragment>
      <Typography variant="h6" color="textSecondary">
        <Text translation="common.referenced.by" />
      </Typography>
      <div>
        {
          refSummary.map((reference) => (
            <div key={reference.id}>
              <Link
                to={reference.url}
                id="References-linkButton"
                target="_blank"
              >
                {reference.title}
              </Link>
            </div>
          ))
        }
      </div>
    </React.Fragment>
  );
};

export default References;
