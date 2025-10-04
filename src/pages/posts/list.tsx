import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
  Pagination,
  Chip,
  Alert,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useQuery } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { useNavigate } from "react-router";
import { isAuthenticated } from "@/utils/authUtils";

export default function PostsList() {
  const [page, setPage] = React.useState(1);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isAuth = isAuthenticated();

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", page],
    queryFn: () => postService.getPosts(page, 10),
  });

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Không thể tải danh sách bài viết. Vui lòng thử lại sau.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header Section */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        mb={4}
      >
        <Box>
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            📝 Bảng Tin
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isLoading ? (
              <Skeleton width={200} />
            ) : (
              `Tổng cộng ${data?.total || 0} bài viết`
            )}
          </Typography>
        </Box>
        {isAuth && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/posts/create")}
            fullWidth={isMobile}
            sx={{
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: 3,
              "&:hover": {
                boxShadow: 6,
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Tạo Bài Viết Mới
          </Button>
        )}
      </Stack>

      {/* Posts List */}
      {isLoading ? (
        <Stack spacing={3}>
          {[1, 2, 3].map((i) => (
            <Card key={i} sx={{ borderRadius: 3 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="40%" />
              </CardContent>
            </Card>
          ))}
        </Stack>
      ) : data?.posts && data.posts.length > 0 ? (
        <>
          <Stack spacing={3}>
            {data.posts.map((post) => (
              <Card
                key={post.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: 8,
                    transform: "translateY(-4px)",
                  },
                  overflow: "hidden",
                }}
              >
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  {/* Title */}
                  <Typography
                    variant={isMobile ? "h6" : "h5"}
                    fontWeight="bold"
                    gutterBottom
                    sx={{
                      color: "text.primary",
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.title}
                  </Typography>

                  {/* Content Preview */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.6,
                    }}
                  >
                    {post.content}
                  </Typography>

                  {/* Meta Information */}
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 1, sm: 2 }}
                    flexWrap="wrap"
                    sx={{ mt: 2 }}
                  >
                    <Chip
                      icon={<PersonIcon />}
                      label={post.authorName}
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ fontWeight: 500 }}
                    />
                    <Chip
                      icon={<CalendarTodayIcon />}
                      label={formatDate(post.createdAt)}
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  </Stack>
                </CardContent>

                <CardActions
                  sx={{
                    px: { xs: 2, sm: 3 },
                    pb: { xs: 2, sm: 3 },
                    pt: 0,
                    justifyContent: "flex-end",
                  }}
                >
                  {isMobile ? (
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/posts/${post.id}`)}
                      sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => navigate(`/posts/${post.id}`)}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        px: 3,
                      }}
                    >
                      Xem Chi Tiết
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </Stack>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mt: 4,
                mb: 2,
              }}
            >
              <Pagination
                count={data.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "large"}
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: 2,
                    fontWeight: 600,
                  },
                }}
              />
            </Box>
          )}
        </>
      ) : (
        <Card
          sx={{
            borderRadius: 3,
            textAlign: "center",
            py: 8,
            bgcolor: "background.default",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            📭 Chưa có bài viết nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hãy là người đầu tiên tạo bài viết!
          </Typography>
          {isAuth && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate("/posts/create")}
            >
              Tạo Bài Viết Đầu Tiên
            </Button>
          )}
        </Card>
      )}
    </Container>
  );
}
