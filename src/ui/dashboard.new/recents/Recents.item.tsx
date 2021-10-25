import {
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import { ReactComponent as FMIcon } from "../../../assets/images/FM.svg";
import { ReactComponent as MPIIcon } from "../../../assets/images/MPI.svg";
import { ReactComponent as ApprovalIcon } from "../../../assets/images/pending_approval.svg";
import { ReactComponent as POIcon } from "../../../assets/images/PO.svg";
import { ReactComponent as SOPIcon } from "../../../assets/images/SOP.svg";
import Colors from "../../layout/theme/utils/colors";
import { styles } from "./Recents.item.styles";

interface Props {
  index: number;
  id: string;
  docId: string;
  type: string;
  title: string;
  accessedAt: string;
}
const RecentsLineItem: React.FunctionComponent<Props> = ({
  id,
  docId,
  type,
  title,
  accessedAt,
}) => {
  const classes = styles();
  const itemTypes = ["PO", "MPI", "FORM", "SUPPLIER", "CHANGE_REQUEST", "DAM"];

  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const StyledListItem = withStyles({
    root: {
      "&:hover": {
        backgroundColor: Colors.sky_blue,
      },
    },
  })(ListItem);

  return (
    <>
      <StyledListItem button onClick={handleClick}>
        <ListItemIcon className={classes.listItemIcon}>
          <>
            {type === "PO" && <POIcon />}
            {type === "MPI" && <MPIIcon />}
            {type === "FORM" && <FMIcon />}
            {(type === "CHANGE_REQUEST" || type === "DAM") && <ApprovalIcon />}
            {(type === "SUPPLIER" || !itemTypes.includes(type)) && <SOPIcon />}
          </>
        </ListItemIcon>
        <ListItemText
          primary={
            <React.Fragment>
              <Grid
                container={true}
                md={12}
                sm={12}
                wrap="nowrap"
                justify="flex-start"
                alignItems="center"
              >
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    {docId}&nbsp;
                  </Typography>
                </Grid>
                {type === "PO" && <Grid item={true}>
                  <Typography
                    component="span"
                    variant="body2"
                    className={classes.typography}
                    color="textPrimary"
                    noWrap
                  >
                    to&nbsp;
                  </Typography>
                </Grid>}
                <Grid zeroMinWidth item={true} className={classes.truncateText}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.typographyBold}
                    color="textSecondary"
                    noWrap
                  >
                    {title}
                  </Typography>
                  &nbsp;&nbsp;
                </Grid>
                <Grid item={true} className={classes.blackDot}>
                &nbsp;
                </Grid>
                <Grid item={true}>
                  <Typography
                    component="span"
                    variant="caption"
                    className={classes.timestampContainer}
                    color="textSecondary"
                  >
                    &nbsp;{accessedAt}
                  </Typography>
                </Grid>
              </Grid>
            </React.Fragment>
          }
        />
      </StyledListItem>
    </>
  );
};

export default RecentsLineItem;
