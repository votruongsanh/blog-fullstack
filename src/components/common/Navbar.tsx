import { ROUTE_PAGES } from "@/config/routePage";
import { useAuth } from "@/hooks/useAuth";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import ColorModeIconDropdown from "./ColorModeToggle";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "inherit",
            }}
            onClick={() => navigate(isAuthenticated ? "/home" : "/")}
          >
            Blog App
          </Typography>

          {/* Desktop Navigation Menu - Centered (ẩn ở mobile) */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 2,
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <Button
              color="inherit"
              onClick={() => navigate("/home")}
              sx={{ textTransform: "none" }}
            >
              Home
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate(ROUTE_PAGES.GALLERY)}
              sx={{ textTransform: "none" }}
            >
              Gallery
            </Button>
          </Box>

          {/* Spacer for mobile - ensures right side stays right-aligned */}
          <Box sx={{ display: { xs: "flex", sm: "none" }, flexGrow: 1 }} />

          {/* Desktop Right Side */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {/* Mobile Hamburger */}
            <MobileMenu />

            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {!isAuthenticated ? (
                <>
                  <Button
                    color="inherit"
                    variant="outlined"
                    size="small"
                    onClick={() => navigate("/login")}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Login
                  </Button>
                  <Button
                    color="primary"
                    variant="contained"
                    size="small"
                    onClick={() => navigate(ROUTE_PAGES.AUTH.REGISTER)}
                    sx={{ borderRadius: 2, textTransform: "none" }}
                  >
                    Register
                  </Button>
                </>
              ) : (
                <>
                  <UserMenu />
                </>
              )}
            </Box>

            <ColorModeIconDropdown />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
