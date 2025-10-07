import { onlineManager } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export function NetworkStatusProvider() {
  const [online, setOnline] = useState(onlineManager.isOnline());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onlineManager.subscribe(() => {
      const nowOnline = onlineManager.isOnline();
      setOnline(nowOnline);
      setOpen(true);
    });
    return () => unsubscribe();
  }, []);

  const handleClose = () => setOpen(false);

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert
        severity={online ? "success" : "warning"}
        onClose={handleClose}
        sx={{ width: "100%" }}
      >
        {online
          ? "✅ You are back online."
          : "⚠️ You are offline. Actions will sync when reconnected."}
      </Alert>
    </Snackbar>
  );
}
