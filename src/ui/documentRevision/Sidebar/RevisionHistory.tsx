import { Box } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { changeRequestEditPath } from "../../change.request/utils/paths";
import DateTime from "../../components/DateTime";
import Text from "../../components/Text";
import { FBMapWrapper } from "../../form.builder";
import Colors from "../../layout/theme/utils/colors";
import styles from "./styles";


interface SidebarPresenterProps {
  changeRequests: ChangeRequest[];
}

export const RevisionHistory: React.FunctionComponent<SidebarPresenterProps> = ({ changeRequests }) => {
  const classes = styles();
  return (
    <Box pt={0.4}>
      <FBMapWrapper collection={changeRequests || []}>
        {(changeRequest, index) => {
          if (!changeRequest) {
            return null;
          }
          return (
            <Box display="flex" key={index} >
              <Box flexGrow={1} borderBottom="1px solid lightgray" mb={2}>
                <Box display="grid">
                  <div className={classes.titleOfRevision}>{changeRequest.owner.user.name}</div>
                  <DateTime value={changeRequest.createdAt as string} />
                </Box>
                <Box mt={1}>
                  <Box color={Colors.hint_gray}><Text translation="common.crid" /></Box>
                  <Link
                    to={changeRequestEditPath(changeRequest.id)}
                    target="_blank"
                    id="ChangeRequestLink-docRev-linkButton"
                    style={{ textDecoration: "none", color: Colors.default_blue }}
                  >
                    <span>{changeRequest.crId}</span>
                  </Link>
                </Box>
                <Box mt={1}>
                  <Box color={Colors.hint_gray}><Text translation="cr.title" /></Box>
                  <Box mr={7}>{changeRequest.title}</Box>
                </Box>
                <Box mt={1}>
                  <Box color={Colors.hint_gray}><Text translation="form.builder.description.of.change" /></Box>
                  <Box mr={7}>{changeRequest.formInput.documentRevisions.map((e) => e.descriptionOfChange)}</Box>
                </Box>
                <Box mt={1} mb={2}>
                  <Box color={Colors.hint_gray}><Text translation="form.builder.justification.of.change" /></Box>
                  <Box mr={7}>{changeRequest.formInput?.documentRevisions.map((e) => e.justificationOfChange)}</Box>
                </Box>
              </Box>
            </Box>); }}
      </FBMapWrapper>
    </Box>
  );
};

export default RevisionHistory;
