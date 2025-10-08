import { ROUTE_PAGES } from "@/config/routePage";
import { useAuth } from "@/hooks/useAuth";
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

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  divider?: boolean;
}

export default function MobileMenu() {
  const { isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems: MenuItem[] = isAuthenticated
    ? [
        {
          id: "home",
          label: "Home",
          icon: <Home />,
          onClick: () => {
            navigate(ROUTE_PAGES.HOME);
            setMobileOpen(false);
          },
        },
        {
          id: "gallery",
          label: "Gallery",
          icon: <Image />,
          onClick: () => {
            navigate(ROUTE_PAGES.GALLERY);
            setMobileOpen(false);
          },
        },
        {
          id: "posts",
          label: "Posts",
          icon: <Article />,
          onClick: () => {
            navigate(ROUTE_PAGES.POSTS.LIST);
            setMobileOpen(false);
          },
        },
        {
          id: "my-posts",
          label: "My Posts",
          icon: <AddLinkOutlined />,
          onClick: () => {
            navigate(ROUTE_PAGES.POSTS.MY_POSTS);
            setMobileOpen(false);
          },
        },
        {
          id: "divider",
          label: "",
          icon: <></>,
          onClick: () => {},
          divider: true,
        },
        {
          id: "logout",
          label: "Logout",
          icon: <Logout />,
          onClick: () => {
            logout();
            setMobileOpen(false);
          },
        },
      ]
    : [
        {
          id: "login",
          label: "Login",
          icon: <Person />,
          onClick: () => {
            navigate(ROUTE_PAGES.AUTH.LOGIN);
            setMobileOpen(false);
          },
        },
        {
          id: "register",
          label: "Register",
          icon: <Article />,
          onClick: () => {
            navigate(ROUTE_PAGES.AUTH.REGISTER);
            setMobileOpen(false);
          },
        },
      ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Typography variant="h6" sx={{ p: 2, pb: 1 }}>
        Blog App
      </Typography>
      <Divider />
      <List>
        {menuItems.map((item) =>
          item.divider ? (
            <Divider key={item.id} sx={{ my: 1 }} />
          ) : (
            <ListItem key={item.id} disablePadding>
              <ListItemButton onClick={item.onClick}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
    </Box>
  );

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
          keepMounted: true, // Better open performance on mobile.
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
