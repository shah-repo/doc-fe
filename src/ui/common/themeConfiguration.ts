import createMuiTheme, { ThemeOptions } from "@material-ui/core/styles/createMuiTheme";

const defaultTheme = createMuiTheme();

const defaultPaletteOptions = {
  primary: {
    main: "#0066FF",
    contrastText: "#fff",
  },
  secondary: {
    dark: "#29064C",
    main: "#6E09EA",
    contrastText: "#fff",
  },
  background: {
    default: "#f0f0f0",
    paper: "#fff",
  },
  text: {
    hint: "#B4C0CA",
    primary: "#4d4d4d",
  },
};

const devPaletteOptions = {
  ...defaultPaletteOptions,
  secondary: {
    ...defaultPaletteOptions.secondary,
    dark: "#FFCA00",
    main: "#EBBA00",
    contrastText: "#29064C",
  },
};

const demoPaletteOptions = {
  ...defaultPaletteOptions,
  secondary: {
    ...defaultPaletteOptions.secondary,
    dark: "#C42260",
    main: "#D52568",
  },
};

const defaultThemeOptions: ThemeOptions = {
  palette: defaultPaletteOptions,
  overrides: {
    MuiAppBar: {
      colorDefault: {
        background: "#fff",
      },
      colorPrimary: {
        background: "transparent",
        backgroundColor: "transparent",
        color: "#4d4d4d",
      },
      root: {
        boxShadow: "none",
      },
    },
    MuiTypography: {
      root: {
        fontFamily: "Open Sans, sans-serif;",
      },
      body2: {
        color: "#8A9DAD",
        fontSize: "0.8rem",
        fontFamily: "Open Sans, sans-serif;",
      },
      subtitle1: {
        color: "#4d4d4d",
        fontSize: "0.8rem",
        fontFamily: "Open Sans, sans-serif;",
      },
      subtitle2: {
        subtitle1: {
          color: "#4d4d4d",
          fontSize: "0.875rem",
          fontFamily: "Open Sans, sans-serif;",
        },
      },
      h5: {
        color: "#4d4d4d",
        fontSize: "1rem",
        fontFamily: "Open Sans, sans-serif;",
      },
      h4: {
        color: "#4d4d4d",
        ontSize: "1.4rem",
      },
      h6: {
        fontSize: "1.1rem",
        fontWeight: "normal",
        fontFamily: "Open Sans, sans-serif;",
      },
    },
    MuiButton: {
      root: {
        fontSize: "0.75rem",
        borderRadius: 3,
        margin: defaultTheme.spacing(1),
      },
    },
    MuiLink: {
      root: {
        fontSize: "0.8rem",
      },
    },
    MuiTableCell: {
      root: {
        fontSize: "0.8rem",
      },
    },
    MuiSelect: {
      icon: {
        right: "10px",
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: "0.8rem",
        maxWidth: "350px",
        overflowWrap: "break-word",
        wordWrap: "break-word",
        hyphens: "auto",
      },
    },
    MuiListItemText: {
      primary: {
        fontSize: "0.9rem",
        color: "#4d4d4d",
      },
    },
    MuiExpansionPanel: {
      root: {
        boxShadow: "none",
      },
    },
    MuiExpansionPanelSummary: {
      root: {
        padding: defaultTheme.spacing(0, 1.9),
      },
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: defaultTheme.spacing(1),
      },
    },
  },
};

export const devEnvThemeOptions: ThemeOptions = {
  ...defaultThemeOptions,
  palette: devPaletteOptions,
};

export const demoEnvThemeOptions: ThemeOptions = {
  ...defaultThemeOptions,
  palette: demoPaletteOptions,
};

export const productionEnvThemeOptions: ThemeOptions = {
  ...defaultThemeOptions,
};
