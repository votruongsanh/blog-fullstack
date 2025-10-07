import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Drawer,
  useMediaQuery,
  useTheme,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

interface GalleryCard {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  author: string;
  views: number;
  likes: number;
}

interface FilterState {
  search: string;
  category: string;
  sortBy: string;
}

const Gallery = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    sortBy: 'newest',
  });

  // Mock data
  const categories = ['All', 'Technology', 'Design', 'Business', 'Lifestyle', 'Travel'];
  const cards: GalleryCard[] = [
    {
      id: 1,
      title: 'Card A',
      description: 'This is the first card in our gallery',
      image: '/api/placeholder/300/200',
      category: 'Technology',
      author: 'John Doe',
      views: 1250,
      likes: 89,
    },
    {
      id: 2,
      title: 'Card B',
      description: 'This is the second card in our gallery',
      image: '/api/placeholder/300/200',
      category: 'Design',
      author: 'Jane Smith',
      views: 890,
      likes: 67,
    },
    {
      id: 3,
      title: 'Card C',
      description: 'This is the third card in our gallery',
      image: '/api/placeholder/300/200',
      category: 'Business',
      author: 'Mike Johnson',
      views: 1456,
      likes: 123,
    },
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const FilterSidebar = () => (
    <Card
      component={motion.div}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        height: 'fit-content',
        position: { xs: 'static', md: 'sticky' },
        top: { md: 20 },
      }}
    >
      <CardHeader
        title="Filters"
        titleTypographyProps={{
          variant: 'h6',
          fontWeight: 600,
        }}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search cards..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          InputProps={{
            startAdornment: (
              <Box
                component={motion.div}
                animate={{
                  scale: filters.search ? 1.2 : 1,
                  color: filters.search ? 'primary.main' : 'text.secondary'
                }}
              >
                <SearchIcon />
              </Box>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              },
              '&.Mui-focused': {
                boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
                transform: 'translateY(-2px)',
              },
            },
          }}
        />

        {/* Category Filter */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={(e) => handleFilterChange('category', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                transition: 'all 0.3s ease-in-out',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              },
            }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category.toLowerCase()}>
                <Box
                  component={motion.div}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  {category}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sort By */}
        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            label="Sort By"
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                transition: 'all 0.3s ease-in-out',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'secondary.main',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderWidth: 2,
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              },
            }}
          >
            <MenuItem value="newest">
              <Box
                component={motion.div}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Newest
              </Box>
            </MenuItem>
            <MenuItem value="oldest">
              <Box
                component={motion.div}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Oldest
              </Box>
            </MenuItem>
            <MenuItem value="popular">
              <Box
                component={motion.div}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Most Popular
              </Box>
            </MenuItem>
            <MenuItem value="views">
              <Box
                component={motion.div}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                Most Views
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        {/* Active Filters */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Active Filters
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filters.category !== 'all' && (
              <Chip
                label={`Category: ${filters.category}`}
                onDelete={() => handleFilterChange('category', 'all')}
                size="small"
              />
            )}
            {filters.search && (
              <Chip
                label={`Search: ${filters.search}`}
                onDelete={() => handleFilterChange('search', '')}
                size="small"
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const GalleryCard = ({ card, index }: { card: GalleryCard; index: number }) => {
    const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

    return (
      <Card
        ref={elementRef}
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{
          duration: 0.6,
          delay: index * 0.1,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        whileHover={{
          y: -8,
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.98 }}
        sx={{
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Hover Overlay */}
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            color: 'white',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            View Details
          </Typography>
        </Box>

        <Box
          sx={{
            height: 200,
            backgroundColor: 'grey.200',
            backgroundImage: `url(${card.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {card.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {card.description}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Chip
              label={card.category}
              size="small"
              sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                }
              }}
            />
            <Typography variant="caption" color="text.secondary">
              {card.views} views • {card.likes} likes
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            textAlign: { xs: 'center', md: 'left' },
            mb: 4,
            fontWeight: 700,
          }}
        >
          Gallery
        </Typography>
      </Box>

      {/* Mobile Filter Button */}
      {isMobile && (
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setDrawerOpen(true)}
          >
            Filters
          </Button>
        </Box>
      )}

      {/* Responsive Layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '280px 1fr',
            lg: '280px 1fr 280px',
          },
          gap: 3,
        }}
      >
        {/* Filter Sidebar - Hidden on mobile (shown in drawer) */}
        {!isMobile && (
          <Box>
            <FilterSidebar />
          </Box>
        )}

        {/* Main Content */}
        <Box>
          <Typography variant="h6" gutterBottom>
            {cards.length} Cards Found
          </Typography>

          {/* Gallery Cards - Responsive Arrangements */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr', // Mobile: 1 column
                sm: '1fr 1fr', // Tablet: 2 columns
                lg: '1fr 1fr 1fr', // Desktop: 3 columns
              },
              gap: 3,
            }}
          >
            {/* Desktop Layout: A, B, C in 3 columns */}
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <GalleryCard card={cards[0]} index={0} />
            </Box>
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <GalleryCard card={cards[1]} index={1} />
            </Box>
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <GalleryCard card={cards[2]} index={2} />
            </Box>

            {/* Tablet Layout: A, B (first row), C (second row) */}
            <Box sx={{ display: { xs: 'none', sm: 'block', lg: 'none' }, gridColumn: 'span 1' }}>
              <GalleryCard card={cards[0]} index={0} />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block', lg: 'none' }, gridColumn: 'span 1' }}>
              <GalleryCard card={cards[1]} index={1} />
            </Box>
            <Box sx={{ display: { xs: 'none', sm: 'block', lg: 'none' }, gridColumn: 'span 2' }}>
              <GalleryCard card={cards[2]} index={2} />
            </Box>

            {/* Mobile Layout: B (first), A (second), C (third) */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <GalleryCard card={cards[1]} index={0} />
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <GalleryCard card={cards[0]} index={1} />
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <GalleryCard card={cards[2]} index={2} />
            </Box>
          </Box>
        </Box>

        {/* Right Sidebar - Desktop Only */}
        {isMobile === false && (
          <Box>
            <Card
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              sx={{
                height: 'fit-content',
                position: 'sticky',
                top: 20,
              }}
            >
              <CardHeader
                title="Quick Actions"
                titleTypographyProps={{
                  variant: 'h6',
                  fontWeight: 600,
                }}
              />
              <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" fullWidth>
                  Create New Card
                </Button>
                <Button variant="outlined" fullWidth>
                  View All Categories
                </Button>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters</Typography>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FilterSidebar />
        </Box>
      </Drawer>
    </Container>
  );
};

export default Gallery;
