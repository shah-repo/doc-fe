import { ListItem, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { stripTags } from "../../../common/utils/helpers";
import { DataProps } from "../../../state/ducks/common";
import { DocumentRevision } from "../../../state/ducks/documentRevisions";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import Text from "../../components/Text";
import useCRLink from "../../hooks/docCustomization/useCRLink";

export type Props = DataProps<DocumentRevision>;

export const ChangeRequestLink: React.FunctionComponent<Props> = ({
  dataProp,
}) => {
  const isVisible = useCRLink(dataProp?.document?.documentType?.id);
  if (!dataProp || !dataProp.changeRequest) {
    return null;
  }

  const { changeRequest } = dataProp;

  if (!isVisible) {
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
