import { USER_KEY } from "@/config/api";
import type { PostRequest } from "@/interface/postsInterface";
import { postService } from "@/services/postService";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";

const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters long")
    .max(200, "Title cannot exceed 200 characters"),
  content: yup
    .string()
    .required("Content is required")
    .min(20, "Content must be at least 20 characters long")
    .max(10000, "Content cannot exceed 10000 characters"),
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

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
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
          Can't load the article. Please try again later.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/posts")}
        >
          Back to List
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
          ✏️ Edit
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
          Back
        </Button>
      </Stack>

      {/* Error Alert */}
      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Can't update the article. Please try again later.
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
                    label="Title"
                    placeholder="Enter an engaging title for your article..."
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
                    label="Content"
                    placeholder="Write detailed content for your article..."
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
                  Cancel
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
                    ? "Saving..."
                    : "Save Changes"}
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
            ⚠️ Note:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Changes will be saved immediately
            <br />
            • Check the content before saving
            <br />• You can view the article again after updating
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
