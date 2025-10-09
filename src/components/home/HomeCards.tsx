import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";

interface PopularPost {
  id: number;
  title: string;
  author: string;
  views: number;
  category: string;
}

interface LatestPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  category: string;
}

interface Statistic {
  label: string;
  value: number;
  icon: React.ReactNode;
}

interface PopularPostsCardProps {
  posts: PopularPost[];
}

interface LatestPostsCardProps {
  posts: LatestPost[];
}

interface StatisticsCardProps {
  stats: Statistic[];
}

export const PopularPostsCard: React.FC<PopularPostsCardProps> = ({
  posts,
}) => {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader title="Popular Posts" />
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {posts.map((post, index) => (
            <Box key={post.id}>
              <Box
                component={motion.div}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  cursor: "pointer",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "action.hover",
                    transform: "translateY(-2px)",
                    boxShadow: 2,
                  },
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      minWidth: "24px",
                      color: "primary.main",
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {post.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      by {post.author}
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Chip
                    label={post.category}
                    size="small"
                    variant="outlined"
                    sx={{
                      fontSize: "0.75rem",
                      "&:hover": {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {post.views.toLocaleString()} views
                  </Typography>
                </Box>
              </Box>
              {index < posts.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export const LatestPostsCard: React.FC<LatestPostsCardProps> = ({ posts }) => {
  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader title="Latest Posts" />
      <CardContent sx={{ flex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {posts.map((post) => (
            <Box
              key={post.id}
              component={motion.div}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              sx={{
                p: 2,
                borderRadius: 1,
                cursor: "pointer",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "action.hover",
                  transform: "translateY(-2px)",
                  boxShadow: 2,
                },
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 500,
                  mb: 1,
                  color: "text.primary",
                }}
              >
                {post.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {post.excerpt}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  by {post.author} • {post.publishedAt}
                </Typography>
                <Chip
                  label={post.category}
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    "&:hover": {
                      backgroundColor: "secondary.main",
                      color: "secondary.contrastText",
                    },
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ stats }) => {
  const { elementRef, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.3,
  });

  // Call useCountUp for each stat at component level
  const count1 = useCountUp(stats[0]?.value || 0, { duration: 1500 }).count;
  const count2 = useCountUp(stats[1]?.value || 0, { duration: 1500 }).count;
  const count3 = useCountUp(stats[2]?.value || 0, { duration: 1500 }).count;
  const count4 = useCountUp(stats[3]?.value || 0, { duration: 1500 }).count;

  const animatedCounts = [count1, count2, count3, count4];

  return (
    <Card
      ref={elementRef}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardHeader
        title="Statistics"
        sx={{
          pb: { xs: 1.5, sm: 2 },
          "& .MuiCardHeader-title": {
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
            fontWeight: 600,
          },
        }}
      />
      <CardContent sx={{ flex: 1, p: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(2, 1fr)",
              md: "repeat(1, 1fr)",
            },
            gap: { xs: 1.5, sm: 2 },
            p: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          {stats.map((stat, index) => (
            <Box
              key={index}
              component={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                isVisible
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.8 }
              }
              transition={{
                duration: 0.4,
                delay: 0.1 + index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              sx={{
                textAlign: "center",
                p: { xs: 1.5, sm: 2 },
                borderRadius: 1.5,
                backgroundColor: "background.paper",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  backgroundColor: "action.hover",
                  boxShadow: 3,
                },
              }}
            >
              <Box
                sx={{
                  mb: { xs: 1, sm: 1.5 },
                  display: "flex",
                  justifyContent: "center",
                  "& .MuiSvgIcon-root": {
                    fontSize: { xs: 28, sm: 32, md: 36 },
                    p: { xs: 1, sm: 1.2, md: 1.4 },
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    color: "primary.contrastText",
                    boxShadow: 2,
                  },
                }}
              >
                {stat.icon}
              </Box>
              <Typography
                variant="h4"
                component={motion.span}
                initial={{ scale: 0 }}
                animate={isVisible ? { scale: 1 } : { scale: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + index * 0.1,
                  type: "spring",
                  stiffness: 200,
                }}
                sx={{
                  fontWeight: 700,
                  color: "text.primary",
                  mb: 0.5,
                  fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
                }}
              >
                {animatedCounts[index]?.toLocaleString()}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
