import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const mockPosts = [
  { id: 1, title: "First Blog Post", excerpt: "This is a short intro..." },
  { id: 2, title: "Second Blog Post", excerpt: "Another quick snippet..." },
];

export default function BlogList() {
  return (
    <Box sx={{ p: 3 }}>
      {/* Header + Add Post */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">
          Blog Posts
        </Typography>
        <Button variant="contained" color="success" startIcon={<AddIcon />}>
          Add Post
        </Button>
      </Stack>

      {/* Posts */}
      <Stack spacing={2}>
        {mockPosts.map((post) => (
          <Card key={post.id} sx={{ bgcolor: "background.paper" }}>
            <CardContent>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {post.excerpt}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" startIcon={<EditIcon />} color="info">
                Edit
              </Button>
              <Button size="small" startIcon={<DeleteIcon />} color="error">
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}
