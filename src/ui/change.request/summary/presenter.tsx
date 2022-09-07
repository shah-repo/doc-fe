import { Box, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { FormikProps } from "formik";
import React from "react";
import { ChangeRequest } from "../../../state/ducks/changeRequest/types";
import { DataProps } from "../../../state/ducks/common/types";
import { AsyncState } from "../../../state/types";
import SummaryField from "../../common/summary/NewBase";
import SummaryFieldWithHtml from "../../common/summary/NewBaseWithHtml";
import FormMessage from "../../components/forms/FormMessage";
import FormProgress from "../../components/forms/FormProgress";
import { FB } from "../../form.builder";
import { ChangeRequestFormValues } from "../form/types";
import Approvers from "./approvers";

const styles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      margin: 0,
      width: "100%",
      paddingLeft: "34px",
      paddingRight: "34px",
    },
    fbContainer: {
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
    <Box height="calc(100vh - 122px)" overflow="auto" className="hide-scroll">
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
      </Grid>
    </Box>
  ); };

export default Presenter;
