import { Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { DocumentRevisionDocument } from "../../../../state/ducks/documentRevisions";
import Text from "../../../components/Text";
import { documentVersionPath } from "../../../document.revision/utils/paths";

export interface Props {
  document?: Partial<DocumentRevisionDocument>;
}

// TODO: check if this component is used
export const References: React.FunctionComponent<Props> = ({
  document,
}) => {
  if (
    document &&
    document.referencedBy &&
    document.referencedBy.length > 0
  ) {
    return (
      <React.Fragment>
        <Typography variant="h6" color="textSecondary">
          <Text translation="common.referenced.by" />
        </Typography>
        <div>
          {
            document.referencedBy.map((reference) => (
              <div key={reference.id}>
                <Link
                  to={documentVersionPath(
                    reference.id,
                    reference.document.id,
                  )}
                  id="References-linkButton"
                  target="_blank"
                >
                  {reference.name}
                </Link>
              </div>
            ))
          }
        </div>
      </React.Fragment>
    );
  }

  return null;
};

export default References;
