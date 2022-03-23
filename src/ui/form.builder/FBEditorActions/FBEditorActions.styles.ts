import Colors from "../../layout/theme/utils/colors";

type TextTransform = "none" | "capitalize" | "uppercase" | "lowercase" | "initial" | "inherit";

const styles = {
  cancelStyle: {
    padding: "20px",
    width: "83px",
    height: "36px",
    background: Colors.sky_blue,
    borderRadius: "100px",
    color: Colors.navy,
    textTransform: "capitalize" as TextTransform,
    fontFamily: "Sora",
    border: `1px solid ${Colors.sky_blue}`,
  },
  submitStyle: {
    padding: "20px",
    width: "66px",
    height: "36px",
    background: Colors.navy,
    borderRadius: "100px",
    color: Colors.white,
    textTransform: "capitalize" as TextTransform,
    fontFamily: "Sora",
    border: `1px solid ${Colors.navy}`,
  },
};

export default styles;
