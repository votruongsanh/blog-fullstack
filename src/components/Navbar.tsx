import { useAuth } from "@/hooks/useAuth";
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/home")}
          >
            Blog App
          </Typography>

          {isAuthenticated && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography variant="body1">Xin chào, {user?.name}</Typography>
              <Button color="inherit" onClick={() => navigate("/posts")}>
                Bài viết
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </Box>
          )}

          {!isAuthenticated && (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Đăng ký
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
