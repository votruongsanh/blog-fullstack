import { ROUTE_PAGES } from "@/config/routePage";
import { useAuth } from "@/hooks/useAuth";
import { useMatchRoute, type Route } from "@/hooks/useMatchRoute";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useScrollProgress } from "../../hooks/useParallax";
import ColorModeIconDropdown from "./ColorModeToggle";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";

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
  // Scroll direction logic (ổn định)
  // -------------------------------
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Chặn tick quá dày
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const isScrollingDown =
            currentScrollY > lastScrollY.current && currentScrollY > 80;

          setVisible(!isScrollingDown);
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const activeRoute = useMatchRoute(navigationItems);

  // -------------------------------
  // Define action items
  // -------------------------------
  const actionItems: ActionItem[] = isAuthenticated
    ? [{ id: "user-menu", component: <UserMenu key="user-menu" /> }]
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
        position="fixed"
        elevation={0}
        sx={{
          top: 0,
          left: 0,
          right: 0,
          color: "text.primary",
          zIndex: (theme) => theme.zIndex.drawer + 2,
          // Dựa theo mức cuộn để thay đổi style
          backgroundColor: `rgba(255, 255, 255, ${0.6 + scrollProgress * 0.4})`, // mờ → đậm dần
          backdropFilter: `blur(${4 + scrollProgress * 8}px)`, // tăng độ blur khi cuộn
          boxShadow:
            scrollProgress > 0.05
              ? "0 2px 12px rgba(0,0,0,0.1)"
              : "0 0 0 rgba(0,0,0,0)",
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          opacity: visible ? 1 : 0.9,
          transition: "all 0.3s ease",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              gap: 2,
              minHeight: {
                xs: 56 - scrollProgress * 10,
                sm: 64 - scrollProgress * 12,
              },
              transition: "min-height 0.3s ease",
            }}
          >
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

            {/* Desktop navigation */}
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

            {/* Right actions */}
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
      {/* Spacer tránh che nội dung */}
      <Toolbar />
      {/* Scroll progress indicator */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 3,
          width: "100%",
          backgroundColor: "transparent",
          zIndex: (theme) => theme.zIndex.drawer + 3,
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${scrollProgress * 100}%`,
            background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
            transition: "width 0.1s ease-out",
            transformOrigin: "left",
          }}
        />
      </Box>
    </Box>
  );
}
