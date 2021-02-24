import { Box, Chip, Grid, Typography } from "@material-ui/core";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Employee } from "../../../state/ducks/company/types";
import Text from "../../components/Text";
import styles from "./styles";

interface OwnProps {
  groupName: string;
  employees: Employee[];
}

type Props = OwnProps;

const GroupsDisplayContent: React.FunctionComponent<Props> = ({
  groupName,
  employees,
}) => {
  const classes = styles();
  const history = useHistory();

  // this is a hack for back button to redirect to group management table
  useEffect(() => () => {
    history.goForward();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memberChipRenderer = (employees: Employee[]) => (
    employees.map((employee) => (
      employee.user &&
      <Chip
        key={employee.id}
        label={employee.user.name}
        className={classes.chip}
      />
    ))
  );
  const membersRenderer = (employees: Employee[]) => (
    <Box width={700} mt={5}>
      <Typography variant="h4">
        <Text translation={"common.members"} />
      </Typography>
      <Box mt={2}>
        {memberChipRenderer(employees)}
      </Box>
    </Box>
  );

  const groupNameRenderer = () => (
    <Box width={700}>
      <Typography variant="h4" style={{ marginBottom: "16px" }} >
        <Text translation={"common.group.name"} />
      </Typography>
      <Text message={groupName} />
    </Box>
  );

  return (
    <Grid
      container={true}
      alignItems="center"
      direction="column"
      className={classes.grid}
    >
      {groupNameRenderer()}
      {membersRenderer(employees)}
    </Grid>
  );
};

export default GroupsDisplayContent;
