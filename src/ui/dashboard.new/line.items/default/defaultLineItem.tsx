import {
  Grid,
  ListItem,
  ListItemText,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import Colors from "../../../layout/theme/utils/colors";
import { styles } from "./defaultLineItem.styles";

interface Props {
  type: string;
  status: string | undefined;
  onMouseHoverItem: (arId: string | undefined) => void;
}
const approvalChangePresenter: React.FunctionComponent<Props> = ({
  type,
  status,
  onMouseHoverItem,
}) => {
  const classes = styles();

  const StyledListItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: Colors.sky_blue,
      },
    },
  })(ListItem);

  const onMouseHoverItemListItem = () => {
    onMouseHoverItem("");
  };

  return (
    <StyledListItem button onMouseEnter={onMouseHoverItemListItem}>
      <ListItemText
        primary={
          <>
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
          </>
        }
      />
    </StyledListItem>
  );
};

export default approvalChangePresenter;
