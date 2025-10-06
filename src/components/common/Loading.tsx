import {
  Box,
  CircularProgress,
  Skeleton,
  Typography,
  type SxProps,
  type Theme,
} from "@mui/material";
import React from "react";

interface LoadingProps {
  type?: "spinner" | "skeleton" | "full-page";
  message?: string;
  sx?: SxProps<Theme>;
  skeletonVariant?: "text" | "circular" | "rectangular";
  skeletonCount?: number;
}

const Loading: React.FC<LoadingProps> = ({
  type = "spinner",
  message = "Đang tải...",
  sx,
  skeletonVariant = "text",
  skeletonCount = 3,
}) => {
  const commonSx: SxProps<Theme> = {
    // Explicit type cho sx
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    ...sx,
  };

  if (type === "full-page") {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          zIndex: 9999,
          ...commonSx,
        }}
      >
        <CircularProgress size={60} />
        {message && (
          <Typography variant="h6" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  if (type === "skeleton") {
    return (
      <Box sx={commonSx}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton
            key={index}
            variant={skeletonVariant}
            width={skeletonVariant === "text" ? "100%" : 100}
            height={skeletonVariant === "rectangular" ? 100 : undefined}
            sx={{ mb: 1 }}
          />
        ))}
      </Box>
    );
  }

  // Default: spinner
  return (
    <Box sx={commonSx}>
      <CircularProgress />
      {message && (
        <Typography variant="body2" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loading;
