import { createStyles, makeStyles } from "@material-ui/core";

export const styles = makeStyles(() =>
  createStyles({
    container: {
      marginLeft: 50
    },
    collapsableButton: {
      width: "100%",
      borderRadius: 0,
      justifyContent: 'end'
    },
    collapsableContainer: {
      maxHeight: 700,
      overflowY: 'auto',
    },
    changeContainer: {
      borderBottom: '1px solid lightgray',
      marginBottom: 20,
    },
    dateContainer: {
      marginBottom: 10
    }
  },
));