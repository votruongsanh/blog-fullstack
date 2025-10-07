import { ROUTE_PAGES } from "@/config/routePage";
import { useUpdatePost } from "@/hooks/usePosts";
import type { PostRequest } from "@/interface/postsInterface";
import { queryClient } from "@/lib/react-query";
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
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router";
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

  const post = useLoaderData();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostRequest>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
    },
  });

  const { mutate: updatePost, error, isPending } = useUpdatePost();

  const onSubmit = (data: PostRequest) => {
    updatePost({ id: id!, data });
  };

  // Nếu cache bị xóa (do tab khác delete), redirect về list
  React.useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === "removed") {
        const [key, postId] = event.query.queryKey;
        if (key === "post" && postId === id) {
          navigate(ROUTE_PAGES.POSTS.LIST, { replace: true });
        }
      }
    });

    return unsubscribe;
  }, [queryClient, id, navigate]);

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Can't load the article. Please try again later.
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTE_PAGES.POSTS.LIST)}
        >
          Back to List
        </Button>
      </Container>
    );
  }

  if (isPending) {
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
          onClick={() => navigate(ROUTE_PAGES.POSTS.DETAIL(id!))}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Back
        </Button>
      </Stack>

      <>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Can't update the article. Please try again later.
          </Alert>
        )}
      </>

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
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
                    disabled={isSubmitting || isPending}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

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
                    disabled={isSubmitting || isPending}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(ROUTE_PAGES.POSTS.DETAIL(id!))}
                  disabled={isSubmitting || isPending}
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
                  disabled={isSubmitting || isPending}
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
                  {isSubmitting || isPending ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

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
