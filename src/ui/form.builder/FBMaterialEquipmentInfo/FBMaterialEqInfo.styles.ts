import { createStyles, makeStyles, Theme } from "@material-ui/core";
import Colors from "../../layout/theme/utils/colors";


export const styles = makeStyles((theme: Theme) =>
  createStyles({

    expandCollapseText: {
      color: "red",
    },
    panelBorder: {
      marginBottom: 5,
      border: `1px solid ${Colors.gray_goose}`,
      borderRadius: "4px",
    },
    pannelHeader: {
      fontWeight: 600,
      fontSize: 16,
    },
    fontText: {
      fontWeight: 600,
      fontSize: 12,
      marginBottom: 20,
    },
    fontNormal: {
      fontWeight: 400,
      fontSize: 12,
    },
    panelSummary: {
      "fontWeight": 600,
      "fontSize": 16,
      "flexDirection": "row-reverse",
      "padding": 0,
      "margin": 0,
      "height": "55px",
      "alignItems": "center",
      "& .Mui-expanded": {
        height: "55px",
        alignItems: "center",
      },

    },

  })
);
