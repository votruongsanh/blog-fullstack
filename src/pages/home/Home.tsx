import ArticleIcon from "@mui/icons-material/Article";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import {
  LatestPostsCard,
  PopularPostsCard,
  StatisticsCard,
} from "../../components/home/HomeCards";
import { useParallax } from "../../hooks/useParallax";

const Home = () => {
  const parallaxOffset = useParallax({ speed: 0.3, direction: "up" });
  // const scrollProgress = useScrollProgress();

  // Mock data - in a real app, this would come from an API
  const popularPosts = [
    {
      id: 1,
      title: "Getting Started with React and TypeScript",
      author: "John Doe",
      views: 12500,
      category: "Tutorial",
    },
    {
      id: 2,
      title: "Advanced MUI Theming Techniques",
      author: "Jane Smith",
      views: 8900,
      category: "Design",
    },
    {
      id: 3,
      title: "Building Responsive Web Applications",
      author: "Mike Johnson",
      views: 6700,
      category: "Development",
    },
    {
      id: 4,
      title: "State Management Best Practices",
      author: "Sarah Wilson",
      views: 5400,
      category: "React",
    },
  ];

  const latestPosts = [
    {
      id: 1,
      title: "Optimizing Performance in Modern React Apps",
      excerpt:
        "Learn how to identify and fix performance bottlenecks in your React applications...",
      author: "Alex Chen",
      publishedAt: "2 hours ago",
      category: "Performance",
    },
    {
      id: 2,
      title: "CSS Grid vs Flexbox: When to Use What",
      excerpt:
        "Understanding the differences and use cases for CSS Grid and Flexbox layouts...",
      author: "Emma Davis",
      publishedAt: "4 hours ago",
      category: "CSS",
    },
    {
      id: 3,
      title: "TypeScript Advanced Types Deep Dive",
      excerpt:
        "Exploring advanced TypeScript types and how to use them effectively...",
      author: "Chris Brown",
      publishedAt: "6 hours ago",
      category: "TypeScript",
    },
  ];

  const statistics = [
    {
      label: "Total Posts",
      value: 1250,
      icon: <ArticleIcon sx={{ fontSize: 32, color: "primary.main" }} />,
    },
    {
      label: "Total Views",
      value: 45000,
      icon: <VisibilityIcon sx={{ fontSize: 32, color: "secondary.main" }} />,
    },
    {
      label: "Active Users",
      value: 890,
      icon: <PeopleIcon sx={{ fontSize: 32, color: "success.main" }} />,
    },
    {
      label: "Growth Rate",
      value: 12.5,
      icon: <TrendingUpIcon sx={{ fontSize: 32, color: "warning.main" }} />,
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Parallax Header Section */}
      <Box
        sx={{
          position: "relative",
          height: 400,
          mb: 6,
          overflow: "hidden",
          borderRadius: 2,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        {/* Parallax Background Elements */}
        <Box
          component={motion.div}
          animate={{ y: parallaxOffset }}
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            zIndex: -1,
          }}
        />

        {/* Floating Elements */}
        <Box
          component={motion.div}
          animate={{ y: parallaxOffset * 0.5 }}
          sx={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            boxShadow: "0 4px 20px rgba(255, 255, 255, 0.3)",
          }}
        />
        <Box
          component={motion.div}
          animate={{ y: parallaxOffset * 0.7 }}
          sx={{
            position: "absolute",
            top: "60%",
            right: "15%",
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            boxShadow: "0 2px 15px rgba(255, 255, 255, 0.2)",
          }}
        />

        {/* Scroll Progress Indicator */}
        {/* <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            transformOrigin: "left",
            transform: `scaleX(${scrollProgress})`,
            transition: "transform 0.1s ease-out",
            zIndex: 2,
          }}
        /> */}

        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            position: "relative",
            zIndex: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: { xs: "center", md: "flex-start" },
            px: 4,
            color: "white",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              textAlign: { xs: "center", md: "left" },
              mb: 4,
              fontWeight: 700,
              color: "white",
              textShadow: "2px 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            Welcome to Our Bulletin Board
          </Typography>

          <Typography
            variant="h6"
            sx={{
              textAlign: { xs: "center", md: "left" },
              mb: 6,
              maxWidth: 600,
              color: "rgba(255, 255, 255, 0.9)",
              textShadow: "1px 1px 4px rgba(0,0,0,0.5)",
            }}
          >
            Discover amazing content, connect with fellow developers, and stay
            updated with the latest trends.
          </Typography>
        </Box>
      </Box>

      {/* Responsive Grid Layout */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr", // Mobile: 1 column
            md: "1fr 1fr", // Tablet: 2 columns (768px-1199px)
            lg: "1fr 1fr 1fr", // Desktop: 3 columns (1200px+)
          },
          gap: 3,
        }}
      >
        {/* Mobile Layout (xs) - All cards stacked vertically */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <PopularPostsCard posts={popularPosts} />
        </Box>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <LatestPostsCard posts={latestPosts} />
        </Box>
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <StatisticsCard stats={statistics} />
        </Box>

        {/* Tablet Layout (md) - 2 columns: Popular+Latest in col1, Statistics in col2 */}
        <Box
          sx={{
            display: { xs: "none", md: "flex", lg: "none" },
            flexDirection: "column",
            gap: 3,
          }}
        >
          <PopularPostsCard posts={popularPosts} />
          <LatestPostsCard posts={latestPosts} />
        </Box>
        <Box
          sx={{
            display: { xs: "none", md: "block", lg: "none" },
          }}
        >
          <StatisticsCard stats={statistics} />
        </Box>

        {/* Desktop Layout (lg) - 3 columns: Popular, Latest, Statistics */}
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <PopularPostsCard posts={popularPosts} />
        </Box>
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <LatestPostsCard posts={latestPosts} />
        </Box>
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <StatisticsCard stats={statistics} />
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
