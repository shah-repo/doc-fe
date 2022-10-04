import { createStyles, makeStyles } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import Colors from "../../layout/theme/utils/colors";

type Props =
  & Pick<ButtonProps, "size">
  & {
    newVariant?: boolean;
    isHover?: boolean;
  };

const SIZES = {
  large: 40,
  medium: 36,
  small: 32,
};

export default makeStyles(() =>
  createStyles({
    root: ({ newVariant, isHover }: Props) => ({
      "margin": "0px",
      "border": `1px dashed ${Colors.navy}`,
      "borderRadius": "100px",
      "background": isHover ? (newVariant ? Colors.dodger_blue : Colors.navy) : Colors.white,
      "color": isHover ? Colors.white : (newVariant ? Colors.dodger_blue : Colors.navy),
      "&:hover": {
        background: newVariant ? Colors.white : Colors.navy,
        color: newVariant ? Colors.dodger_blue : Colors.white,
        boxShadow: newVariant ? "none" : "",
      },
    }),
    label: {
      "padding": "2px",
      "fontWeight": 700,
      "fontSize": "12px",
      "lineHeight": "15px",
      "text-transform": "capitalize",
      "white-space": "nowrap",
    },
    fbBtn: ({ size = "medium" }: Props) => ({
      "height": SIZES[size],
      "borderRadius": "100px",
      "background": Colors.navy,
      "color": Colors.white,
      "border": `1px solid ${Colors.navy}`,
      "boxShadow": "none",
      "&:hover": {
        background: Colors.navy_active,
        borderColor: Colors.navy_active,
        boxShadow: "none",
      },
      "&.Mui-disabled": {
        border: "none",
        backgroundColor: Colors.gains_boro,
        color: Colors.white,
      },
      "&.MuiButton-outlinedPrimary": {
        "backgroundColor": Colors.white,
        "borderColor": Colors.navy,
        "color": Colors.navy,
        "&:hover": {
          background: Colors.background_white,
        },
      },
    }),
  })
);
