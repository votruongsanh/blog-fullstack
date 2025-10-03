import { useAuth } from "@/hooks/useAuth";
import { Article, Logout, Person } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ColorModeToggle from "./common/ColorModeToggle";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const handleNavigate = (path: string) => {
    handleMenuClose();
    navigate(path);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <AppBar position="static" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
            onClick={() => navigate(isAuthenticated ? "/home" : "/")}
          >
            Blog App
          </Typography>

          {/* Right Side Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Tài khoản">
                  <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    sx={{ ml: 1 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "secondary.main",
                        fontSize: "0.875rem",
                      }}
                    >
                      {user?.name ? getInitials(user.name) : <Person />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  slotProps={{
                    paper: {
                      elevation: 3,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                        mt: 1.5,
                        minWidth: 200,
                        "& .MuiAvatar-root": {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {user?.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {user?.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => handleNavigate("/posts")}>
                    <ListItemIcon>
                      <Article fontSize="small" />
                    </ListItemIcon>
                    My posts
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Button
                  color="inherit"
                  variant="text"
                  size="small"
                  onClick={() => navigate("/login")}
                  sx={{ display: { xs: "none", sm: "inline-flex" } }}
                >
                  Login
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </Box>
            )}

            <ColorModeToggle />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
