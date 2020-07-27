import { Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import React from "react";
import Text from "../../components/Text";

interface Props {
  clearFilter?: () => void;
}

const styles = makeStyles((theme: Theme) =>
  createStyles({
    clearButton: {
      margin: theme.spacing(0, 2, 0, 0),
      backgroundColor: theme.palette.common.white,
    },
  },
  ));

export const ClearFilters: React.FunctionComponent<Props> = ({
  clearFilter,
}) => {
  const classes = styles();
  return (
    <Button
      color="primary"
      variant="outlined"
      className={classes.clearButton}
      onClick={clearFilter}
      id="clearFilter"
      data-cy="clearFilter"
    >
      <Text translation="common.clear.filters" />
    </Button>
  );
};

export default ClearFilters;
