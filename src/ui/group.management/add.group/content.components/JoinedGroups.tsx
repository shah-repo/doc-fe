import { Box, Grid, Typography } from "@material-ui/core";
import { isEmpty, uniqBy } from "lodash";
import React from "react";
import { Group } from "../../../../state/ducks/auth/types";
import Text from "../../../components/Text";
import GroupInfoPresenter from "./GroupInfo.presenter";

interface Props {
  parentGroups: any[];
  joinedParents: Group[];
}

export const JoinedGroups: React.FunctionComponent<Props> = ({
  parentGroups,
  joinedParents,
}) => {

  const uniqJoinedParents = uniqBy(joinedParents, "id");

  const inheritText = (parentGroup) => {
    if (!isEmpty(parentGroup.parents)) {
      return `inherits from ${parentGroup.parents.map((parent) => parent.name)}`;
    }
    return "";
  };

  const renderParentContainer = (parentGroup, index) => (
    <Box mt={6} width="700px" padding="10px" border="1px solid grey" borderRadius={4} key={index}>
      <Typography
        variant="h6"
        style={{
          marginBottom: 5,
          borderBottom: "solid",
          borderColor: "grey",
        }}>
        <Text message={`${parentGroup.label || parentGroup.name} ${inheritText(parentGroup)}`}/>
      </Typography>
      <GroupInfoPresenter
        items={parentGroup.permissions}
        title="common.permissions"
      />
      <GroupInfoPresenter
        items={parentGroup.tags}
        title="common.tags"
      />
    </Box>
  );

  const renderSelectedGroupInfo = (parentGroups) => parentGroups.map((parentGroup, index) => {
    if (uniqJoinedParents.some((p) => p.name === parentGroup.label)) {
      return null;
    }
    return renderParentContainer(parentGroup, index);
  });

  const renderJoinedGroupsInfo = (parentGroups) => parentGroups.map((parentGroup, index) =>
    renderParentContainer(parentGroup, index)
  );


  return (
    <Grid>
      {!isEmpty(parentGroups) && renderSelectedGroupInfo(parentGroups)}
      {!isEmpty(uniqJoinedParents) && renderJoinedGroupsInfo(uniqJoinedParents)}
    </Grid>
  );
};

export default JoinedGroups;
