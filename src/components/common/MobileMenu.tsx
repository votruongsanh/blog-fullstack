import { ROUTE_PAGES } from "@/config/routePage";
import { useAuth } from "@/hooks/useAuth";
import { useMatchRoute, type Route } from "@/hooks/useMatchRoute"; // ✅ import hook
import {
  AddLinkOutlined,
  Article,
  Home,
  Image,
  Logout,
  Menu,
  Person,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";

export default function MobileMenu() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  // ----------------------------
  // Define routes for hook
  // ----------------------------
  const menuRoutes: Route[] = isAuthenticated
    ? [
        {
          label: "Home",
          icon: <Home />,
          route: ROUTE_PAGES.HOME,
          routePattern: [ROUTE_PAGES.HOME],
        },
        {
          label: "Gallery",
          icon: <Image />,
          route: ROUTE_PAGES.GALLERY,
          routePattern: [ROUTE_PAGES.GALLERY],
        },
        {
          label: "Posts",
          icon: <Article />,
          route: ROUTE_PAGES.POSTS.LIST,
          routePattern: [
            ROUTE_PAGES.POSTS.LIST,
            ROUTE_PAGES.POSTS.DETAIL(":id"),
            ROUTE_PAGES.POSTS.EDIT(":id"),
          ],
        },
        {
          label: "My Posts",
          icon: <AddLinkOutlined />,
          route: ROUTE_PAGES.POSTS.MY_POSTS,
          routePattern: [ROUTE_PAGES.POSTS.MY_POSTS],
        },
        {
          label: "Logout",
          icon: <Logout />,
          route: "logout",
          routePattern: [],
        },
      ]
    : [
        {
          label: "Login",
          icon: <Person />,
          route: ROUTE_PAGES.AUTH.LOGIN,
          routePattern: [ROUTE_PAGES.AUTH.LOGIN],
        },
        {
          label: "Register",
          icon: <Article />,
          route: ROUTE_PAGES.AUTH.REGISTER,
          routePattern: [ROUTE_PAGES.AUTH.REGISTER],
        },
      ];

  // ----------------------------
  // Detect active route
  // ----------------------------
  const matchedRoute = useMatchRoute(menuRoutes);

  // ----------------------------
  // Drawer content
  // ----------------------------
  const drawer = (
    <Box sx={{ width: 250 }}>
      <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
        Blog App
      </Typography>
      <Divider />
      <List>
        {menuRoutes.map((item, index) => {
          const isActive = matchedRoute?.route === item.route;

          return (
            <React.Fragment key={item.label}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    if (item.route === "logout") logout();
                    else navigate(item.route);
                    setMobileOpen(false);
                  }}
                  sx={{
                    "&:hover": { bgcolor: "action.hover" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "primary.main" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: isActive ? 600 : 400,
                          color: isActive ? "primary.main" : "text.primary",
                        },
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>

              {/* Optional divider after logout */}
              {index === menuRoutes.length - 2 && isAuthenticated && (
                <Divider sx={{ my: 1 }} />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <Box sx={{ display: { xs: "flex", sm: "none" } }}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
      >
        <Menu />
      </IconButton>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // better performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
}
