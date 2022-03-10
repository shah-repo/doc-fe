import { Avatar, Box, Button, ListItem, ListItemAvatar, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { ReactComponent as MigrateIcon } from "../../../assets/images/migrate-icon.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import Text from "../../components/Text";
import ReferencedByContainer from "../../document.revision/summary/referencedBy.container.new";
import ReferenceToContainer from "../../document.revision/summary/referenceTo.container.new";
import { HandleMenuClickContext } from "../Sidebar/Sidebar.container";
import { styles } from "./References.styles";

const References = ({
  owner,
  status,
  referencedBy,
  deprecatedAt,
  referenceTo,
  released,
  formDocument,
}) => {
  const classes = styles();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { handleMenuIconClick, indexOfMigrationTab, showMigration } = React.useContext(HandleMenuClickContext)!;
  return (
    <Box margin={1.875}>
      <Typography className={classes.generalInfo}>
        <Text translation="common.general.info" />
      </Typography>
      <ListItem
        alignItems="flex-start"
        disableGutters
        className={classes.listItem}
      >
        <ListItemAvatar>
          <Avatar
            className={classes.avatar}
            alt={owner.user.name}
            src={owner.user.avatar}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography className={classes.generalInfo}>
              {owner.user.name}
            </Typography>
          }
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                color="textPrimary"
                className={classes.secondaryText}
              >
                Owner
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <ReferenceToContainer
        dataProp={referenceTo}
        status={status}
        deprecatedAt={deprecatedAt}
      />
      <ReferencedByContainer dataProp={referencedBy} />
      <Box>
        <Typography component="span" className={classes.releaseDate}>
          <Text translation="documentRevision.form.release.date" />
        </Typography>
        <Typography className={classes.released}>
          {released
            ? getFormattedDateString(released as string, MomentFormats.YearMonthDate)
            : "None"}
        </Typography>
      </Box>
      <Box pt={2.5}>
        <Typography component="span" className={classes.releaseDate}>
          <Text translation="output.info" />
        </Typography>
        <Typography className={classes.released}>
          {` ${formDocument.docId}, `}
          <Text message="common.revision" />
          {` ${formDocument.version}, `}
          {formDocument.effectiveDate &&
            getFormattedDateString(
              formDocument.effectiveDate,
              MomentFormats.YearMonthDate
            )}
        </Typography>
      </Box>
      {showMigration && <Box display="flex" pt={1.25} alignItems="center">
        <Button
          disableRipple
          disableFocusRipple
          variant="contained"
          className={classes.migrateForm}
          startIcon={<Box mr={0.25}><MigrateIcon /></Box>}
          onClick={() => handleMenuIconClick(indexOfMigrationTab)}
        >
          <Typography component="span" className={classes.migrateFormText}>
            <Text message="common.form.migration" />
          </Typography>
        </Button>
      </Box>}
    </Box>
  );
};

export default References;
