import DarkModeIcon from "@mui/icons-material/DarkModeRounded";
import LightModeIcon from "@mui/icons-material/LightModeRounded";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useColorScheme } from "@mui/material/styles";
import * as React from "react";

export default function ColorModeIconDropdown() {
  const { mode, setMode, systemMode } = useColorScheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  // setMode hoạt động vì chúng ta đã dùng colorSchemeSelector: 'class' trong theme
  const handleMode = (m: "system" | "light" | "dark") => {
    setMode(m);
    handleClose();
  };

  // resolvedMode là mode thực tế đang hiển thị (systemMode fallback)
  const resolvedMode = (systemMode || mode) as "light" | "dark";

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
      >
        {icon}
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
          System
        </MenuItem>
        <MenuItem
          selected={mode === "light"}
          onClick={() => handleMode("light")}
        >
          Light
        </MenuItem>
        <MenuItem selected={mode === "dark"} onClick={() => handleMode("dark")}>
          Dark
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
