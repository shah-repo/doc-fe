import { Box, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { FormikProps } from "formik";
import React from "react";
import { ChangeRequest } from "../../../state/ducks/changeRequest";
import { DataProps } from "../../../state/ducks/common";
import { AsyncState } from "../../../state/types";
import SummaryField from "../../common/summary/base";
import SummaryFieldWithHtml from "../../common/summary/baseWithHtml";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import DocumentRevisionOutputInfo from "../../documentRevision/formBuilder/DocumentRevisionOutputInfo";
import { FB } from "../../form.builder";
import { ChangeRequestFormValues } from "../form/types";
import Approvers from "./approvers";
import SummaryHeader from "./SummaryHeader";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: theme.spacing(2, 0, 0, 0),
      padding: theme.spacing(0, 5),
      width: "100%",
    },
    fbContainer: {
      paddingLeft: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
  }));

interface OwnProps extends DataProps<ChangeRequest> {
  asyncState: AsyncState;
  canEdit: boolean;
  canChangeOwnerShip: boolean;
  FBContainer?: React.MutableRefObject<HTMLDivElement | null>;
}

type Props = OwnProps & FormikProps<ChangeRequestFormValues>;

const Presenter: React.FunctionComponent<Props> = ({
  dataProp,
  asyncState,
  canEdit,
  canChangeOwnerShip,
  errors,
  FBContainer,
}) => {
  const classes = styles();

  const { formState } = FB.useStores();

  // fix for Approvers not changing in AR in review state
  if (formState?.getValues()) {
    dataProp.formInput = formState?.getValues();
  }

  return (
    <Box>
      <SummaryHeader {...{ dataProp, canChangeOwnerShip, asyncState, errors, canEdit }}/>
      <Grid container={true} spacing={4} direction="column" className={classes.container}>
        {canEdit && <FormProgress asyncState={asyncState} />}
        {canEdit && <FormMessage asyncState={asyncState} />}
        <SummaryField
          label="common.title"
          value={dataProp.title}
        />
        <SummaryFieldWithHtml
          label="common.description"
          value={dataProp.description}
        />
        <div className={classes.fbContainer} ref={FBContainer}/>
        <Approvers dataProp={dataProp.approvals}/>
        <DocumentRevisionOutputInfo formDocument={dataProp.formDocument}/>
      </Grid>
    </Box>
  ); };

export default Presenter;
