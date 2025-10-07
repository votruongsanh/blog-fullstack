import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useColorScheme } from "@mui/material/styles";
import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ColorModeIconDropdown() {
  const { mode, setMode, systemMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // Enhanced mode handling with localStorage persistence
  const handleMode = (m: "system" | "light" | "dark") => {
    setMode(m);
    // Save to localStorage for persistence
    localStorage.setItem('theme-mode', m);
    handleClose();
  };

  // resolvedMode is the actual mode being displayed (systemMode fallback)
  const resolvedMode = (systemMode || mode) as "light" | "dark";

  // Load saved theme from localStorage on component mount
  React.useEffect(() => {
    const savedMode = localStorage.getItem('theme-mode') as "system" | "light" | "dark" | null;
    if (savedMode && savedMode !== mode) {
      setMode(savedMode);
    }
  }, [mode, setMode]);

  const icon =
    mode === "system" ? (
      <SettingsBrightnessIcon />
    ) : resolvedMode === "dark" ? (
      <DarkModeIcon />
    ) : (
      <LightModeIcon />
    );

  if (!mode) {
    return (
      <Box
        data-screenshot="toggle-mode"
        sx={(theme) => ({
          verticalAlign: "bottom",
          display: "inline-flex",
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: (theme.vars || theme).shape.borderRadius,
          border: "1px solid",
          borderColor: (theme.vars || theme).palette.divider,
        })}
      />
    );
  }

  return (
    <React.Fragment>
      <IconButton
        data-screenshot="toggle-mode"
        onClick={handleClick}
        disableRipple
        size="small"
        aria-controls={open ? "mode-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        sx={{
          position: 'relative',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedMode}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
        </AnimatePresence>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="mode-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            variant: "outlined",
            elevation: 0,
            sx: {
              my: "4px",
              minWidth: 120,
              '& .MuiMenuItem-root': {
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'translateX(4px)',
                },
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          selected={mode === "system"}
          onClick={() => handleMode("system")}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsBrightnessIcon fontSize="small" />
            System
          </Box>
        </MenuItem>
        <MenuItem
          selected={mode === "light"}
          onClick={() => handleMode("light")}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LightModeIcon fontSize="small" />
            Light
          </Box>
        </MenuItem>
        <MenuItem selected={mode === "dark"} onClick={() => handleMode("dark")}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DarkModeIcon fontSize="small" />
            Dark
          </Box>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
