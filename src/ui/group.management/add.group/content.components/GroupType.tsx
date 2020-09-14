import { Box, FormControlLabel, Radio, RadioGroup, Typography } from "@material-ui/core";
import React from "react";
import { GroupRequestBody } from "../../../../state/ducks/groupManagement";
import Text from "../../../components/Text";

interface Props {
  group: GroupRequestBody;
  setGroup: (values: GroupRequestBody) => void;
}

export const GroupType: React.FunctionComponent<Props> = ({
  group,
  setGroup,
}) => {

  const handleGroupTypeChange = (event: any) => {
    const isOfficial = event.target.value === "official";

    setGroup({
      ...group,
      isOfficial: isOfficial ? true : false,
      permissions: isOfficial ? group.permissions : [],
      tags: isOfficial ? group.tags : [],
      parents: isOfficial ? group.parents : [],
    });
  };

  return (
    <Box width={700} mt={-6} mb={2}>
      <Typography variant="h4" style={{ marginBottom: "16px" }}>
        <Text message={"group.management.group.type"} />
      </Typography>
      <RadioGroup
        id="Group-groupType"
        name="groupType"
        onChange={handleGroupTypeChange}
        value={group.isOfficial ? "official" : "unofficial"}
      >
        <FormControlLabel
          id="Group-officialOption"
          data-cy="Group-officialOption"
          label="Official"
          value="official"
          control={<Radio />}
        />
        <FormControlLabel
          id="Group-unofficialOption"
          data-cy="Group-unofficialOption"
          label="Unofficial"
          value="unofficial"
          control={<Radio />}
        />
      </RadioGroup>
    </Box>
  );
};

export default GroupType;
