import { Box, Button, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { DocumentRevisionFooterNew } from "../../../App";
import { ReactComponent as MigrateIcon } from "../../../assets/images/migrate-icon.svg";
import { getFormattedDateString, MomentFormats } from "../../../common/utils/date";
import Text from "../../components/Text";
import ReferencedByContainer from "../../document.revision/summary/referencedBy.container.new";
import ReferenceToContainer from "../../document.revision/summary/referenceTo.container.new";
import useGetAvailableReferences from "../../hooks/useGetAvailableReferences";
import { isOperator } from "../DocumentRevisionDisplay.container";
import AvailableReferencesField from "../forms/presenters/AvailableReferences.new1";
import { toDocumentRevisionFormValues } from "../forms/transform";
import { isOwner } from "../helpers/documentRevisionPermissions";
import UserAvatarListItem from "../Sidebar/common/UserAvatarListItem";
import { HandleMenuClickContext } from "../Sidebar/Sidebar.container";
import { styles } from "./References.styles";

const References = ({
  selectedDocument,
  edit,
}) => {
  const classes = styles();
  const { owner, status, deprecatedAt, referenceTo, releasedAt, retrain, document } = selectedDocument;
  const initialValues = useMemo(() => toDocumentRevisionFormValues(selectedDocument), [selectedDocument]);
  const availableReferences = useGetAvailableReferences(initialValues);
  const isCurrentUserOperator = React.useContext(isOperator);
  const groupOptions = selectedDocument?.document.documentType.groupOptions;
  const isDisabledInput = initialValues.id !== undefined && isCurrentUserOperator && !isOwner;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const { handleMenuIconClick, indexOfMigrationTab, showMigration } = React.useContext(HandleMenuClickContext)!;
  return (
    <Box margin={1.875}>
      <Typography className={classes.generalInfo}>
        <Text translation="common.general.info" />
      </Typography>
      <UserAvatarListItem
        name={owner.user.name}
        owner={owner}
        secondaryComponent={<Text translation="common.owner" />}
      />
      {edit && (
        <AvailableReferencesField
          availableReferences={availableReferences}
          documentReferences={referenceTo}
          name="referenceTo"
          label="documentRevision.form.references"
          disabled={isDisabledInput}
          documentGroupOptions={groupOptions}
        />
      )}
      {!edit && referenceTo && (
        <ReferenceToContainer
          canEdit={edit}
          dataProp={referenceTo}
          status={status}
          deprecatedAt={deprecatedAt}
        />
      )}
      {document.referencedBy && (
        <ReferencedByContainer dataProp={document.referencedBy} />
      )}
      <Box>
        <Typography component="span" className={classes.releaseDate}>
          <Text translation="common.training" />
        </Typography>
        <Typography className={classes.released}>
          {retrain ? (
            <Text translation="form.builder.yes" />
          ) : (
            <Text translation="form.builder.none" />
          )}
        </Typography>
      </Box>
      <Box pt={2.5}>
        <Typography component="span" className={classes.releaseDate}>
          <Text translation="documentRevision.form.release.date" />
        </Typography>
        <Typography className={classes.released}>
          {releasedAt
            ? getFormattedDateString(
              releasedAt as string,
              MomentFormats.YearMonthDateDotNotation
            )
            : "None"}
        </Typography>
      </Box>
      <DocumentRevisionFooterNew />
      {showMigration && (
        <Box display="flex" pt={1.25} alignItems="center">
          <Button
            disableRipple
            disableFocusRipple
            variant="contained"
            className={classes.migrateForm}
            startIcon={
              <Box mr={0.25}>
                <MigrateIcon />
              </Box>
            }
            onClick={() => handleMenuIconClick(indexOfMigrationTab)}
          >
            <Typography component="span" className={classes.migrateFormText}>
              <Text message="common.form.migration" />
            </Typography>
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default References;
