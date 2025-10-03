import { blue, deepPurple, green, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: blue[600] },
        secondary: { main: "#6d4c41" }, // brown nhạt cho accent
        success: { main: green[600] },
        error: { main: red[600] },
        background: {
          default: "#fafafa",
          paper: "#ffffff",
        },
      },
    },
    dark: {
      palette: {
        primary: { main: deepPurple[400] },
        secondary: { main: "#80cbc4" }, // teal nhạt cho accent
        success: { main: green[400] },
        error: { main: red[400] },
        background: {
          default: "#121212",
          paper: "#1e1e1e",
        },
      },
    },
  },
});

export default theme;
