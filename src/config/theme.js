import { ptBR } from "@mui/material/locale";

/**
 * Application theme configuration
 * 
 * This file centralizes all theme-related configurations and follows
 * the Single Responsibility Principle by only handling theme concerns.
 */
export const themeConfig = {
  palette: {
    background: {
      default: "#0d1b2a",
      paper: "#1a2c3d",
    },
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f50057",
      light: "#ff5983",
      dark: "#c51162",
      contrastText: "#ffffff",
    },
    text: {
      primary: "#ffffff",
      secondary: "#aaaaaa",
      disabled: "#666666",
    },
    divider: "#444444",
    action: {
      active: "#ffffff",
      hover: "rgba(255, 255, 255, 0.08)",
      selected: "rgba(255, 255, 255, 0.16)",
      disabled: "rgba(255, 255, 255, 0.3)",
      disabledBackground: "rgba(255, 255, 255, 0.12)",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#0d1b2a",
          color: "#ffffff",
          margin: 0,
          padding: 0,
        },
        "*": {
          boxSizing: "border-box",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: "1px solid #444444",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.4)",
            },
            "&:hover fieldset": {
              borderColor: "#ffffff",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#1976d2",
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255, 255, 255, 0.4)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ffffff",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1976d2",
          },
        },
      },
    },
  },
};

/**
 * Create theme with locale support
 */
export const createAppTheme = () => {
  return {
    ...themeConfig,
    locale: ptBR,
  };
};

/**
 * Layout constants
 */
export const LAYOUT_CONSTANTS = {
  HEADER_HEIGHT: 64,
  SIDEBAR_WIDTH: 280,
  SIDEBAR_COLLAPSED_WIDTH: 60,
  MOBILE_BREAKPOINT: 'md',
};

/**
 * Z-index constants
 */
export const Z_INDEX = {
  DRAWER: 1200,
  APP_BAR: 1100,
  MODAL: 1300,
  TOOLTIP: 1500,
}; 