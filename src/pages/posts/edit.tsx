import * as React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Stack,
  Alert,
  Container,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { useNavigate, useParams } from "react-router";
import type { PostRequest } from "@/interface/postsInterface";
import { USER_KEY } from "@/config/api";

const schema = yup.object({
  title: yup
    .string()
    .required("Tiêu đề là bắt buộc")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  content: yup
    .string()
    .required("Nội dung là bắt buộc")
    .min(20, "Nội dung phải có ít nhất 20 ký tự")
    .max(10000, "Nội dung không được vượt quá 10000 ký tự"),
});

export default function EditPost() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();

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

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PostRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  // Update form when post data is loaded
  React.useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        content: post.content,
      });
    }
  }, [post, reset]);

  // Check if user is the owner
  React.useEffect(() => {
    if (post && currentUser && post.authorId !== currentUser.id) {
      navigate(`/posts/${id}`);
    }
  }, [post, currentUser, id, navigate]);

  const updateMutation = useMutation({
    mutationFn: (data: PostRequest) => postService.updatePost(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      navigate(`/posts/${id}`);
    },
  });

  const onSubmit = (data: PostRequest) => {
    updateMutation.mutate(data);
  };

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
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 3 }} />
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Skeleton variant="rectangular" height={56} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={300} />
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          color="primary"
        >
          ✏️ Chỉnh Sửa Bài Viết
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/posts/${id}`)}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Quay Lại
        </Button>
      </Stack>

      {/* Error Alert */}
      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Không thể cập nhật bài viết. Vui lòng thử lại sau.
        </Alert>
      )}

      {/* Form Card */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              {/* Title Field */}
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Tiêu đề bài viết"
                    placeholder="Nhập tiêu đề hấp dẫn cho bài viết của bạn..."
                    fullWidth
                    required
                    error={!!errors.title}
                    helperText={errors.title?.message}
                    disabled={isSubmitting || updateMutation.isPending}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

              {/* Content Field */}
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nội dung bài viết"
                    placeholder="Viết nội dung chi tiết cho bài viết của bạn..."
                    fullWidth
                    required
                    multiline
                    rows={isMobile ? 10 : 15}
                    error={!!errors.content}
                    helperText={
                      errors.content?.message ||
                      `${field.value.length}/10000 ký tự`
                    }
                    disabled={isSubmitting || updateMutation.isPending}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

              {/* Action Buttons */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/posts/${id}`)}
                  disabled={isSubmitting || updateMutation.isPending}
                  fullWidth={isMobile}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon />}
                  disabled={isSubmitting || updateMutation.isPending}
                  fullWidth={isMobile}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  {isSubmitting || updateMutation.isPending
                    ? "Đang lưu..."
                    : "Lưu Thay Đổi"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card
        sx={{
          mt: 3,
          borderRadius: 3,
          bgcolor: "warning.lighter",
          border: 1,
          borderColor: "warning.light",
        }}
      >
        <CardContent>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            ⚠️ Lưu ý:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Những thay đổi sẽ được lưu ngay lập tức
            <br />
            • Kiểm tra kỹ nội dung trước khi lưu
            <br />• Bạn có thể xem lại bài viết sau khi cập nhật
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
