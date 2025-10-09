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
import { useScrollProgress } from "../../hooks/useParallax";
import ColorModeIconDropdown from "./ColorModeToggle";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";
import { useMatchRoute, type Route } from "@/hooks/useMatchRoute";

interface NavigationItem extends Route {
  id: string;
  requiresAuth?: boolean;
}

interface ActionItem {
  id: string;
  component: React.ReactNode;
}

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const scrollProgress = useScrollProgress();

  // -------------------------------
  // Define navigation items
  // -------------------------------
  const navigationItems: NavigationItem[] = [
    {
      id: "home",
      label: "Home",
      route: ROUTE_PAGES.HOME,
      routePattern: [ROUTE_PAGES.HOME],
    },
    {
      id: "gallery",
      label: "Gallery",
      route: ROUTE_PAGES.GALLERY,
      routePattern: [ROUTE_PAGES.GALLERY],
    },
    {
      id: "posts",
      label: "Posts",
      route: ROUTE_PAGES.POSTS.LIST,
      routePattern: [
        ROUTE_PAGES.POSTS.LIST,
        ROUTE_PAGES.POSTS.DETAIL(":id"),
        ROUTE_PAGES.POSTS.EDIT(":id"),
      ],
      requiresAuth: true,
    },
  ];

  // -------------------------------
  // Find current active route
  // -------------------------------
  const activeRoute = useMatchRoute(navigationItems);

  // -------------------------------
  // Define action items (login/register/user)
  // -------------------------------
  const actionItems: ActionItem[] = isAuthenticated
    ? [
        {
          id: "user-menu",
          component: <UserMenu key="user-menu" />,
        },
      ]
    : [
        {
          id: "login",
          component: (
            <Button
              key="login"
              color="inherit"
              variant="outlined"
              size="small"
              onClick={() => navigate(ROUTE_PAGES.AUTH.LOGIN)}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Login
            </Button>
          ),
        },
        {
          id: "register",
          component: (
            <Button
              key="register"
              color="primary"
              variant="contained"
              size="small"
              onClick={() => navigate(ROUTE_PAGES.AUTH.REGISTER)}
              sx={{ borderRadius: 2, textTransform: "none" }}
            >
              Register
            </Button>
          ),
        },
      ];

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <Box>
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
              onClick={() => navigate(ROUTE_PAGES.HOME)}
            >
              HyperX
            </Typography>

            {/* Desktop Navigation Menu */}
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 2,
                flexGrow: 1,
                justifyContent: "center",
              }}
            >
              {navigationItems.map((item) => {
                if (item.requiresAuth && !isAuthenticated) return null;

                const isActive = activeRoute?.route === item.route;

                return (
                  <Button
                    key={item.id}
                    color="inherit"
                    onClick={() => navigate(item.route)}
                    sx={{
                      textTransform: "none",
                      fontWeight: isActive ? 700 : 400,
                      color: isActive ? "primary.main" : "text.primary",
                      borderBottom: isActive
                        ? "2px solid"
                        : "2px solid transparent",
                      borderColor: isActive ? "primary.main" : "transparent",
                      borderRadius: 0,
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            {/* Spacer for mobile */}
            <Box sx={{ display: { xs: "flex", sm: "none" }, flexGrow: 1 }} />

            {/* Right side (actions) */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <MobileMenu />

              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {actionItems.map((item) => item.component)}
              </Box>

              <ColorModeIconDropdown />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Scroll progress indicator */}
      <Box
        sx={{
          height: 3,
          background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
          transformOrigin: "left",
          transform: `scaleX(${scrollProgress})`,
          transition: "transform 0.1s ease-out",
          opacity: 0.9,
        }}
      />
    </Box>
  );
}
