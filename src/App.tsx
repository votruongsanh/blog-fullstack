import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { NetworkStatusProvider } from "./components/common/NetworkStatusProvider";
import AuthProvider from "./context/AuthContext";
import { queryClient } from "./lib/react-query";
import { router } from "./router";
import AppThemeProvider from "./theme/AppThemeProvider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <AuthProvider>
          <NetworkStatusProvider />
          <RouterProvider router={router} />
        </AuthProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
