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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postService } from "@/services/postService";
import { useNavigate } from "react-router";
import type { PostRequest } from "@/interface/postsInterface";

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

export default function CreatePost() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: PostRequest) => postService.createPost(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate(`/posts/${data.id}`);
    },
  });

  const onSubmit = (data: PostRequest) => {
    createMutation.mutate(data);
  };

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
          ✍️ Tạo Bài Viết Mới
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/posts")}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Quay Lại
        </Button>
      </Stack>

      {/* Error Alert */}
      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Không thể tạo bài viết. Vui lòng thử lại sau.
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
                    disabled={isSubmitting || createMutation.isPending}
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
                    disabled={isSubmitting || createMutation.isPending}
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
                  onClick={() => navigate("/posts")}
                  disabled={isSubmitting || createMutation.isPending}
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
                  disabled={isSubmitting || createMutation.isPending}
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
                  {isSubmitting || createMutation.isPending
                    ? "Đang lưu..."
                    : "Đăng Bài"}
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
          bgcolor: "info.lighter",
          border: 1,
          borderColor: "info.light",
        }}
      >
        <CardContent>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            💡 Mẹo viết bài:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Tiêu đề ngắn gọn, súc tích và thu hút
            <br />
            • Nội dung rõ ràng, dễ hiểu
            <br />
            • Chia đoạn hợp lý để dễ đọc
            <br />• Kiểm tra chính tả trước khi đăng
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
