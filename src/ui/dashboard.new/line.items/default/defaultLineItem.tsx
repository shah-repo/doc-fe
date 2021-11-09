import { Grid, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { StyledListItem } from "../common/StyledListItem";
import { styles } from "./defaultLineItem.styles";

interface Props {
  type: string;
  status: string | undefined;
  onMouseHoverItem: (id: string) => void;
}
const approvalChangePresenter: React.FunctionComponent<Props> = ({
  type,
  status,
  onMouseHoverItem,
}) => {
  const classes = styles();

  const onMouseHoverListItem = () => {
    onMouseHoverItem("");
  };

  return (
    <StyledListItem button onMouseEnter={onMouseHoverListItem}>
      <ListItemText
        primary={
          <Grid container={true}>
            <Grid item={true} md={12} sm={12}>
              <Typography
                component="span"
                variant="body2"
                className={classes.typography}
                color="textPrimary"
              >
                {type}&nbsp;
              </Typography>
              <Typography
                component="span"
                variant="caption"
                className={classes.typographyBold}
                color="textSecondary"
              >
                {status}&nbsp;
              </Typography>
            </Grid>
          </Grid>
        }
      />
    </StyledListItem>
  );
};

export default approvalChangePresenter;
