import { ROUTE_PAGES } from "@/config/routePage";
import { useCreatePost } from "@/hooks/usePosts";
import type { PostRequest } from "@/interface/postsInterface";
import { yupResolver } from "@hookform/resolvers/yup";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import * as yup from "yup";

const schema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title cannot exceed 200 characters"),
  content: yup
    .string()
    .required("Content is required")
    .min(20, "Content must be at least 20 characters")
    .max(10000, "Content cannot exceed 10000 characters"),
});

export default function CreatePost() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<PostRequest>({
    resolver: yupResolver(schema),
    mode: "onTouched", // hiển thị lỗi sau khi blur
    defaultValues: { title: "", content: "" },
  });

  const createMutation = useCreatePost();
  const isDisabled = isSubmitting || createMutation.isPending;

  const onSubmit = (data: PostRequest) => createMutation.mutate(data);

  // Theo dõi realtime content để hiển thị số ký tự
  const contentValue = watch("content", "");

  return (
    <Container maxWidth="md" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      {/* ---------------- HEADER ---------------- */}
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
          ✍️ Create New Post
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(ROUTE_PAGES.POSTS.LIST)}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Back
        </Button>
      </Stack>

      {/* ---------------- ERROR ALERT ---------------- */}
      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Can't create the post. Please try again later.
        </Alert>
      )}

      {/* ---------------- FORM ---------------- */}
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={3}>
              {/* ---------------- TITLE ---------------- */}
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Title"
                    placeholder="Enter an engaging title..."
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message || ""}
                    disabled={isDisabled}
                    inputProps={{ maxLength: 200 }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                )}
              />

              {/* ---------------- CONTENT ---------------- */}
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Content"
                    placeholder="Write detailed content..."
                    fullWidth
                    multiline
                    rows={isMobile ? 10 : 15}
                    error={!!errors.content}
                    helperText={
                      errors.content?.message ||
                      `${contentValue.length}/10000 characters`
                    }
                    disabled={isDisabled}
                    inputProps={{ maxLength: 10000 }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                )}
              />

              {/* ---------------- ACTION BUTTONS ---------------- */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="flex-end"
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate(ROUTE_PAGES.POSTS.LIST)}
                  disabled={isDisabled}
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
                  disabled={isDisabled}
                  fullWidth={isMobile}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    boxShadow: 3,
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  {isDisabled ? "Saving..." : "Create Post"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* ---------------- TIPS ---------------- */}
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
            💡 Tips for writing:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Title should be concise, catchy, and engaging
            <br />
            • Content should be clear and easy to understand
            <br />
            • Segment your ideas logically for readability
            <br />• Proofread before publishing
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
