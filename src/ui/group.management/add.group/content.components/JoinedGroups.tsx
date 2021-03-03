import { Box, Grid, Typography } from "@material-ui/core";
import { isEmpty, uniqBy } from "lodash";
import React from "react";
import { useSelector } from "react-redux";
import { userManagementSelectors } from "../../../../state/ducks/userManagement";
import Text from "../../../components/Text";
import GroupInfoPresenter from "./GroupInfo.presenter";

interface Props {
  parentGroups: any[];
}

const JoinedGroups: React.FunctionComponent<Props> = ({
  parentGroups,
}) => {
  const allGroups = useSelector(userManagementSelectors.getOfficialGroups);

  const inheritText = (parentGroup) => {
    if (!isEmpty(parentGroup.parents)) {
      return `inherits from ${parentGroup.parents.map((parent) => parent.name)}`;
    }
    return "";
  };

  const renderParentContainer = (parentGroup) => parentGroup.map((p) => (
    <Box mt={6} width="700px" padding="10px" border="1px solid grey" borderRadius={4} key={p.id}>
      <Typography
        variant="h6"
        style={{
          marginBottom: 5,
          borderBottom: "solid",
          borderColor: "grey",
        }}>
        <Text message={`${p.name} ${inheritText(p)}`}/>
      </Typography>
      <GroupInfoPresenter
        items={p.permissions}
        title="common.permissions"
      />
      <GroupInfoPresenter
        items={p.tags}
        title="common.tags"
      />
    </Box>)
  );

  const renderSelectedGroupInfo = (parentGroups) => {
    const arrayOfIds = parentGroups.map((p) => p.value);
    const savedParents = allGroups.filter((group) => arrayOfIds.includes(group.value));
    const ids = savedParents.map((s) => s.joinedParents.map((e) => e));
    return renderParentContainer(uniqBy(ids.flat(), "id"));
  };

  return (
    <Grid>
      {!isEmpty(parentGroups) && renderSelectedGroupInfo(parentGroups)}
    </Grid>
  );
};

export default JoinedGroups;
