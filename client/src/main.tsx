import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "sonner";
import "./index.css";
import App from "./App.tsx";
import { QueryProvider } from "./providers/query.provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <NuqsAdapter>
        <Toaster richColors />
        <App />
      </NuqsAdapter>
    </QueryProvider>
  </StrictMode>,
);
