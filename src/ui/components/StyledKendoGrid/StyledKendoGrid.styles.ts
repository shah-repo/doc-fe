import { makeStyles } from "@material-ui/core";
import { Colors } from "../../layout/theme-next";

const BASE_COLOR = Colors.primaryBg;

export default makeStyles((theme) => ({
  "@global": {
    ".k-grid": {
      borderRadius: theme.shape.borderRadius,
      border: `1px solid ${Colors.tableStroke}`,
      backgroundColor: Colors.tableStroke,
      color: Colors.textBlack,
      overflow: "hidden",
    },
    ".k-grid-toolbar": {
      padding: theme.spacing(1.25, 2, 0),
      backgroundColor: BASE_COLOR,
      border: "none",
    },
    ".k-grouping-header": {
      "padding": theme.spacing(1.25, 1),
      "backgroundColor": BASE_COLOR,
      "border": "none",
      "fontSize": 12,

      "&.k-grouping-header-flex": {
        gap: `${theme.spacing(2)}px`,
      },
      "& .k-indicator-container": {
        padding: 0,
        margin: 0,
      },
      "& .k-group-indicator": {
        "borderRadius": 30,
        "backgroundColor": Colors.white,
        "height": 30,
        "padding": theme.spacing(.5, 1.25),
        "border": "none",

        "& .k-link .k-icon": {
          margin: theme.spacing(0, 1.25, 0, 0),
          color: Colors.textGray,
          fontSize: 12,
          fontWeight: 600,
        },
        "& .k-button-icon": {
          "margin": theme.spacing(0, 0, 0, 1.25),
          "color": Colors.primaryLight,
          "minWidth": 0,
          "opacity": 1,

          "&:hover": {
            color: Colors.primary,
          },
        },
      },
    },
    ".k-grid-header": {
      "backgroundColor": BASE_COLOR,
      "border": "none",
      "paddingInlineEnd": 0,

      "& .k-grid-header-wrap": {
        borderColor: "transparent",
        borderWidth: "0 0 0 0",
        marginRight: 0,
      },
      "& table": {
        minWidth: "100%",
      },
      "& tr": {
        "&:first-child th": {
          paddingTop: theme.spacing(1.25),
        },
        "&:last-child th": {
          paddingBottom: theme.spacing(1.25),
        },
      },
      "& th": {
        "padding": theme.spacing(.5, 2),
        "border": "none",
        "borderRight": `1px solid ${Colors.white}`,

        "&:not(.k-grid-header-sticky) + .k-grid-header-sticky": {
          borderRight: `1px solid ${Colors.white}`,
          boxShadow: "-5px 12px 10px 2px rgba(0, 0, 0, .1)",
          clipPath: "inset(0 0 0 -20px)",
        },
        "&.k-grid-header-sticky": {
          "backgroundColor": BASE_COLOR,
          "border": "none",
          "borderRight": `1px solid ${Colors.white}`,

          "&:has(+ :not(.k-grid-header-sticky))": {
            borderRightColor: "transparent",
            boxShadow: "5px 12px 10px 2px rgba(0, 0, 0, .1)",
            clipPath: "inset(0 -20px 0 0)",
          },
        },
        "&:has(+ .k-grid-header-sticky)": {
          borderRightColor: "transparent",
        },
        "&.k-sorted": {
          // "backgroundColor": BASE_COLOR, // TODO check with UX team
        },
        "&:last-child": {
          borderRight: "none",
        },
        "&[role=presentation]": {
          borderRight: "none",
        },
      },
      "& .k-filter-row": {
        "& th:not([aria-label])": {
          borderRight: "none",
        },
        "& th": {
          "&:not(.k-grid-header-sticky) + .k-grid-header-sticky": {
            boxShadow: "-5px 0 10px 2px rgba(0, 0, 0, .1)",
          },
          "&.k-grid-header-sticky": {
            "&:has(+ :not(.k-grid-header-sticky))": {
              boxShadow: "5px 0 10px 2px rgba(0, 0, 0, .1)",
            },
          },
        },
        "& .k-textbox": {
          width: "100%",
        },
        "& .k-button": {
          marginLeft: theme.spacing(.5),
        },
        "& .k-button:not(.k-clear-button-visible)": {
          display: "none",
        },
      },
      "& .k-link .k-icon": {
        color: Colors.textGray,
        fontWeight: 600,
        fontSize: 12,
        verticalAlign: "0.1em",
        marginLeft: theme.spacing(.5),
      },
      "& .k-header": {
        verticalAlign: "middle",
      },
      "& .k-column-title": {
        minWidth: 0,
        flexShrink: 1,
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden",
        fontWeight: 600,
      },
      "& .k-grid-column-menu": {
        "top": theme.spacing(.5),

        "&:hover": {
          backgroundColor: "transparent",
        },
      },
    },
    ".k-grid-content": {
      "overflow": "auto",
      "overflowX": "auto",
      "overflowY": "auto",

      "& table": {
        minWidth: "100%",
      },
      "& tr": {
        "cursor": "pointer", // TODO move to concrete component
        "height": 40,

        "&.k-grouping-row": {
          backgroundColor: Colors.gray,
        },
        "& td": {
          "border": "none",
          "padding": theme.spacing(.75, 2),
          "borderBottom": `1px solid ${Colors.tableStroke}`,
          "backgroundColor": Colors.white,
          "whiteSpace": "nowrap", // TODO move to concrete component

          "&.k-group-cell": {
            backgroundColor: Colors.gray,
          },
          "&:not(.k-grid-content-sticky) + .k-grid-content-sticky": {
            boxShadow: "-5px 0 10px 2px rgba(0, 0, 0, .1)",
            clipPath: "inset(0 0 0 -20px)",
          },
          "&.k-grid-content-sticky": {
            "borderColor": Colors.tableStroke,

            "&:has(+ :not(.k-grid-content-sticky))": {
              boxShadow: "5px 0 10px 2px rgba(0, 0, 0, .1)",
              clipPath: "inset(0 -20px 0 0)",
            },
          },
          "&.k-sorted": {
            // backgroundColor: "transparent", // TODO check with UX team
          },
          "&#kendo-expandable-column": {
            whiteSpace: "normal", // TODO remove this rule in favor of custom cell template
          },
        },
        "&.k-alt": {
          "backgroundColor": Colors.white,

          "& .k-grid-content-sticky": {
            backgroundColor: Colors.white,
          },

          "&:hover td": {
            backgroundColor: Colors.hover,
          },
        },
        "&:hover td": {
          "backgroundColor": Colors.hover,

          "&.k-grid-content-sticky": {
            backgroundColor: Colors.hover,
          },
          "&.k-group-cell": {
            backgroundColor: Colors.hover,
          },
        },
        "&:last-child td": {
          "borderBottom": "none",

          "&:not(.k-grid-content-sticky) + .k-grid-content-sticky": {
            boxShadow: "-5px -12px 10px 2px rgba(0, 0, 0, .1)",
          },
          "&.k-grid-content-sticky": {
            "&:has(+ :not(.k-grid-content-sticky))": {
              boxShadow: "5px -12px 10px 2px rgba(0, 0, 0, .1)",
            },
          },
        },
      },
    },
    ".k-grid-footer": {
      background: BASE_COLOR,
      color: Colors.textBlack,
      border: "none",
    },
    ".k-pager": {
      "backgroundColor": BASE_COLOR,
      "fontSize": 14,
      "color": Colors.textBlack,
      "padding": theme.spacing(1.25, 2.5),
      "gap": `${theme.spacing(.25)}px`,

      "& .k-pager-info": {
        margin: 0,
      },
      "& .k-pager-numbers": {
        gap: `${theme.spacing(.25)}px`,
      },
      "& .k-link": {
        "color": Colors.textBlack,
        "borderRadius": 50,
        "width": 30,
        "height": 30,

        "&:focus": {
          boxShadow: "none",
          color: Colors.primary,
          backgroundColor: Colors.white,
        },
        "&:hover": {
          color: Colors.primary,
          backgroundColor: Colors.white,
        },
        "&.k-pager-nav": {
          color: Colors.primary,
        },
        "&.k-pager-nav .k-icon": {
          fontSize: 14,
        },
        "&.k-pager-first .k-icon": {
          fontSize: 12,
        },
        "&.k-pager-last .k-icon": {
          fontSize: 12,
        },
        "&.k-state-selected": {
          backgroundColor: Colors.primary,
          color: Colors.white,
          fontWeight: 600,
        },
        "&.k-state-disabled": {
          color: Colors.statusClosed,
        },
      },
    },
    // TODO switch to MUI components and remove these styles
    ".k-button": {
      "height": 30,
      "minWidth": 30,
      "color": Colors.textGray,
      "background": "none",
      "backgroundColor": Colors.white,
      "borderRadius": theme.shape.borderRadius / 2,
      "border": `1px solid ${Colors.tableStroke}`,

      "&:hover": {
        backgroundColor: Colors.hover,
        borderColor: Colors.tableStroke,
      },
      "&:focus": {
        boxShadow: "none",
        backgroundColor: Colors.hover,
        borderColor: Colors.tableStroke,
      },
      "&:disabled": {
        color: Colors.buttonDisabled,
        background: Colors.gray,
        opacity: .6,
      },
    },
    ".k-textbox": {
      "height": 30,
      "backgroundColor": Colors.white,
      "borderRadius": theme.shape.borderRadius / 2,
      "border": `1px solid ${Colors.tableStroke}`,

      "&:hover": {
        backgroundColor: Colors.gray,
        borderColor: Colors.tableStroke,
      },
      "&:focus": {
        boxShadow: "none",
        backgroundColor: Colors.white,
        borderColor: Colors.primaryLight,
      },
    },
    ".k-dropdown": {
      "& .k-dropdown-wrap": {
        "height": 30,
        "background": "none",
        "backgroundColor": Colors.white,
        "borderRadius": theme.shape.borderRadius / 2,
        "border": `1px solid ${Colors.tableStroke}`,

        "&:hover": {
          backgroundColor: Colors.gray,
          borderColor: Colors.tableStroke,
        },
        "&:focus": {
          boxShadow: "none",
          backgroundColor: Colors.white,
          borderColor: Colors.primaryLight,
        },
        "&.k-state-focused": {
          boxShadow: "none",
          backgroundColor: Colors.white,
          borderColor: Colors.primaryLight,
        },
      },
    },
    ".k-select": {
      "& .k-icon": {
        color: Colors.textGray,
        fontSize: 12,
      },
    },
    ".k-popup": {
      border: `1px solid ${Colors.stroke}`,
      margin: theme.spacing(.5, 0),
      borderRadius: theme.shape.borderRadius / 2,
      overflow: "hidden",
    },
    ".k-list-container": {
      "fontSize": ".875rem",

      "& > .k-popup": {
        "& .k-state-selected": {
          "color": Colors.textBlack,
          "backgroundColor": Colors.primaryHighlight,

          "&:hover": {
            color: Colors.textBlack,
            backgroundColor: Colors.primaryHighlight,
          },
        },
      },
      "& .k-list-optionlabel": {
        "padding": theme.spacing(.5, 1.5),

        "&:hover": {
          backgroundColor: Colors.hover,
        },
      },
      "& .k-item": {
        "padding": theme.spacing(.5, 1.5),

        "&:hover": {
          backgroundColor: Colors.hover,
        },
      },
    },
    ".k-grid-columnmenu-popup": {
      "& .k-columnmenu-item": {
        "padding": theme.spacing(1, 1.5),
        "minHeight": 48,
        "display": "flex",
        "alignItems": "center",

        "&:hover": {
          backgroundColor: Colors.hover,
        },
      },
      "& .k-icon": {
        minWidth: 20,
        fontSize: 16,
        color: Colors.textGray,
        marginRight: theme.spacing(1.75),
      },
    },
    ".k-animation-container": {
      "boxShadow": "none",

      "& > .k-popup": {
        boxShadow: "none",
      },
      "&.k-animation-container-shown": {
        "& > .k-popup": {
          boxShadow: theme.shadows[2],
        },
      },
    },
    ".k-checkbox": {
      "border": `2px solid ${Colors.textBlack}`,
      "background": Colors.white,
      "borderRadius": theme.shape.borderRadius / 2,

      "&:disabled": {
        opacity: 1,
        backgroundColor: Colors.hover,
        borderColor: Colors.buttonDisabled,
      },
      "&:checked": {
        "backgroundColor": Colors.primary,
        "borderColor": Colors.primary,
        "color": Colors.white,

        "&:disabled": {
          opacity: 1,
          backgroundColor: Colors.buttonDisabled,
          borderColor: Colors.buttonDisabled,
        },
      },
      "&.k-checked": {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
        color: Colors.white,
      },
    },
    ".k-icon": {
      "&.k-i-arrow-s::before": {
        fontFamily: "FontAwesome",
        fontWeight: "600",
        content: "'\\f107'",
      },
      "&.k-i-arrow-n::before": {
        fontFamily: "FontAwesome",
        fontWeight: "600",
        content: "'\\f106'",
      },
      "&.k-i-filter::before": {
        fontFamily: "FontAwesome",
        content: "'\\f0b0'",
      },
      "&.k-i-filter-clear::before": {
        fontFamily: "FontAwesome",
        content: "'\\e17d'",
      },
      "&.k-i-more-vertical::before": {
        fontFamily: "FontAwesome",
        content: "'\\f142'",
      },
      "&.k-i-sort-asc-sm::before": {
        fontFamily: "FontAwesome",
        fontWeight: "600",
        content: "'\\2191'",
      },
      "&.k-i-sort-desc-sm::before": {
        fontFamily: "FontAwesome",
        fontWeight: "600",
        content: "'\\2193'",
      },
      "&.k-i-eye::before": {
        fontFamily: "FontAwesome",
        content: "'\\f06e'",
      },
      "&.k-i-unlock::before": {
        fontFamily: "FontAwesome",
        content: "'\\f2dc'",
      },
      "&.k-i-lock::before": {
        fontFamily: "FontAwesome",
        content: "'\\f2dc'",
      },
      "&.k-i-group::before": {
        fontFamily: "FontAwesome",
        content: "'\\f247'",
      },
      "&.k-i-ungroup::before": {
        fontFamily: "FontAwesome",
        content: "'\\f248'",
      },
      "&.k-i-group-delete::before": {
        fontFamily: "FontAwesome",
        fontWeight: "600",
        content: "'\\f057'",
      },
      "&.k-i-arrow-end-left::before": {
        fontFamily: "FontAwesome",
        fontWeight: "600",
        content: "'\\f323'",
      },
      "&.k-i-arrow-end-right::before": {
        fontFamily: "FontAwesome",
        fontWeight: "600",
        content: "'\\f324'",
      },
      "&.k-i-arrow-60-left::before": {
        fontFamily: "FontAwesome",
        fontWeight: "600",
        content: "'\\f104'",
      },
      "&.k-i-arrow-60-right::before": {
        fontFamily: "FontAwesome",
        fontWeight: "600",
        content: "'\\f105'",
      },
    },
  },
}));
