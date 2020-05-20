import { ListItem, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { stripTags } from "../../../common/utils/helpers";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { DynamicUIDocTypes } from "../../../state/ducks/documentRevisions/documentType";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import Text from "../../components/Text";

export type Props = DataProps<DocumentRevision>;

export const ChangeRequestLink: React.FunctionComponent<Props> = ({
  dataProp,
}) => {
  if (!dataProp || !dataProp.changeRequest) {
    return null;
  }

  const acronym = dataProp?.document?.documentType?.documentTypeAcronym;
  const hideLink = acronym === (
    DynamicUIDocTypes.PO ||
    DynamicUIDocTypes.RC ||
    DynamicUIDocTypes.SUP ||
    DynamicUIDocTypes.WO
  );
  const { changeRequest } = dataProp;

  if (hideLink) {
    return null;
  }

  return (
    <ListItem>
      <Typography variant="h6">
        <Text translation="common.crid" />
        :&nbsp;
        <Link to={changeRequestEditPath(changeRequest.id)} target="_blank" id="ChangeRequestLink-linkButton" >
          <Tooltip title={stripTags(changeRequest.description)} id="ChangeRequestLink-tootlip" >
            <span>{changeRequest.crId}</span>
          </Tooltip>
        </Link>
      </Typography>
    </ListItem>
  );
};

export default ChangeRequestLink;
