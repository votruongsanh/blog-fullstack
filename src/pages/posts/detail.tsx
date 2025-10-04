import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  Container,
  useTheme,
  useMediaQuery,
  Skeleton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpdateIcon from "@mui/icons-material/Update";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { useNavigate, useParams } from "react-router";
import { isAuthenticated } from "@/utils/authUtils";
import { USER_KEY } from "@/config/api";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isAuth = isAuthenticated();
  const queryClient = useQueryClient();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  // Get current user
  const currentUser = React.useMemo(() => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }, []);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPost(id!),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => postService.deletePost(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/posts");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
    setOpenDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const isOwner = currentUser && post && currentUser.id === post.authorId;

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Không thể tải bài viết. Vui lòng thử lại sau.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/posts")}
        >
          Quay Lại Danh Sách
        </Button>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Skeleton variant="text" width="80%" height={60} />
            <Skeleton variant="text" width="30%" sx={{ mt: 2 }} />
            <Skeleton variant="text" width="30%" />
            <Divider sx={{ my: 3 }} />
            <Skeleton variant="rectangular" height={200} />
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Không tìm thấy bài viết.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/posts")}
        >
          Quay Lại Danh Sách
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Back Button */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/posts")}
        sx={{
          mb: 3,
          textTransform: "none",
          borderRadius: 2,
        }}
      >
        Quay Lại Danh Sách
      </Button>

      {/* Post Content Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          {/* Title */}
          <Typography
            variant={isMobile ? "h5" : "h4"}
            fontWeight="bold"
            gutterBottom
            sx={{
              color: "text.primary",
              mb: 3,
              lineHeight: 1.3,
            }}
          >
            {post.title}
          </Typography>

          {/* Meta Information */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            flexWrap="wrap"
            sx={{ mb: 2 }}
          >
            <Chip
              icon={<PersonIcon />}
              label={`Tác giả: ${post.authorName}`}
              size={isMobile ? "small" : "medium"}
              variant="filled"
              color="primary"
              sx={{ fontWeight: 600 }}
            />
            <Chip
              icon={<CalendarTodayIcon />}
              label={`Đăng: ${formatDate(post.createdAt)}`}
              size={isMobile ? "small" : "medium"}
              variant="outlined"
              color="default"
            />
            {post.updatedAt !== post.createdAt && (
              <Chip
                icon={<UpdateIcon />}
                label={`Cập nhật: ${formatDate(post.updatedAt)}`}
                size={isMobile ? "small" : "medium"}
                variant="outlined"
                color="info"
              />
            )}
          </Stack>

          <Divider sx={{ my: 3 }} />

          {/* Content */}
          <Typography
            variant="body1"
            sx={{
              color: "text.primary",
              lineHeight: 1.8,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {post.content}
          </Typography>
        </CardContent>

        {/* Action Buttons (Only for owner) */}
        {isAuth && isOwner && (
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: "background.default",
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="flex-end"
            >
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/posts/${id}/edit`)}
                fullWidth={isMobile}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                }}
              >
                Chỉnh Sửa
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setOpenDeleteDialog(true)}
                fullWidth={isMobile}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                }}
              >
                Xóa Bài Viết
              </Button>
            </Stack>
          </Box>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>
          Xác Nhận Xóa Bài Viết
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
