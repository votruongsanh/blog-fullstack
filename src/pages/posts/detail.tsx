import { useAuth } from "@/hooks/useAuth";
import { useDeletePost, usePost } from "@/hooks/usePosts";
import { queryClient } from "@/lib/react-query";
import { formatDate } from "@/utils/format";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import UpdateIcon from "@mui/icons-material/Update";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import * as React from "react";
import { useNavigate, useParams } from "react-router";

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { isAuthenticated } = useAuth();
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  // Get current user
  const { user } = useAuth();

  const { data: post, isLoading, error } = usePost(id);

  const deleteMutation = useDeletePost();

  const handleDelete = () => {
    deleteMutation.mutate(id!);
    setOpenDeleteDialog(false);
  };

  // Nếu cache bị xóa (do tab khác delete), redirect về list
  React.useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === "removed") {
        const [key, postId] = event.query.queryKey;
        if (key === "post" && postId === id) {
          navigate("/posts", { replace: true });
        }
      }
    });

    return unsubscribe;
  }, [queryClient, id, navigate]);

  const isOwner = user && post && user.id === post.authorId;

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          The article could not be loaded. Please try again later.
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
          The article could not be found.
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
        Back to List
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
            spacing={1}
            flexWrap="wrap"
          >
            <Chip
              icon={<PersonIcon />}
              label={`${post?.author?.name}`}
              size={isMobile ? "small" : "medium"}
              variant="filled"
              color="primary"
              sx={{
                fontWeight: 600,
                width: { xs: "fit-content", sm: "auto" },
                alignSelf: "flex-start",
              }}
            />
            <Chip
              icon={<CalendarTodayIcon />}
              label={`Created: ${formatDate(post?.createdAt)}`}
              size={isMobile ? "small" : "medium"}
              variant="outlined"
              color="default"
              sx={{
                width: { xs: "fit-content", sm: "auto" },
                alignSelf: "flex-start",
              }}
            />
            {post.updatedAt !== post.createdAt && (
              <Chip
                icon={<UpdateIcon />}
                label={`Updated: ${formatDate(post?.updatedAt)}`}
                size={isMobile ? "small" : "medium"}
                variant="outlined"
                color="info"
                sx={{
                  width: { xs: "fit-content", sm: "auto" },
                  alignSelf: "flex-start",
                }}
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
        {isAuthenticated && isOwner && (
          <Box
            sx={{
              p: { xs: 2, sm: 3 },
              bgcolor: "background.default",
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="flex-end">
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
                Edit
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
                Delete
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
          Delete Confirmation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this article? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            disabled={deleteMutation.isPending}
            sx={{ textTransform: "none" }}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
