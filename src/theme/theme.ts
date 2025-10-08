import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  blue,
  cyan,
  deepPurple,
  green,
  orange,
  red,
} from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    h1: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontSize: "2.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontSize: "1.25rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h5: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontSize: "1.125rem",
      fontWeight: 500,
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
      fontSize: "1rem",
      fontWeight: 500,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
    },
  },
  palette: {
    primary: {
      main: blue[600],
      light: blue[400],
      dark: blue[800],
      contrastText: "#ffffff",
    },
    secondary: {
      main: orange[500],
      light: orange[300],
      dark: orange[700],
      contrastText: "#ffffff",
    },
    success: {
      main: green[600],
      light: green[400],
      dark: green[800],
    },
    error: {
      main: red[600],
      light: red[400],
      dark: red[800],
    },
    warning: {
      main: orange[600],
      light: orange[400],
      dark: orange[800],
    },
    info: {
      main: cyan[600],
      light: cyan[400],
      dark: cyan[800],
    },
    background: {
      default: "#fafafa",
      paper: "#ffffff",
    },
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: blue[600], contrastText: "#ffffff" },
        secondary: { main: orange[500], contrastText: "#ffffff" },
        success: { main: green[600] },
        error: { main: red[600] },
        warning: { main: orange[600] },
        info: { main: cyan[600] },
        background: {
          default: "#fafafa",
          paper: "#ffffff",
        },
        text: {
          primary: "rgba(0, 0, 0, 0.87)",
          secondary: "rgba(0, 0, 0, 0.6)",
        },
      },
    },
    dark: {
      palette: {
        primary: { main: deepPurple[400], contrastText: "#ffffff" },
        secondary: { main: cyan[400], contrastText: "#000000" },
        success: { main: green[400] },
        error: { main: red[400] },
        warning: { main: orange[400] },
        info: { main: cyan[400] },
        background: {
          default: "#121212",
          paper: "#1e1e1e",
        },
        text: {
          primary: "rgba(255, 255, 255, 0.87)",
          secondary: "rgba(255, 255, 255, 0.6)",
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#6b6b6b #2b2b2b",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            backgroundColor: "#2b2b2b",
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#6b6b6b",
            minHeight: 24,
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#8b8b8b",
            },
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: "xl",
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
          },
        },
      },
    },
  },
});

export default theme;
