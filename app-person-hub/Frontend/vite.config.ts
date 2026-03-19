import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(".", "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("recharts")) return "charts";
          if (id.includes("@dnd-kit")) return "dnd";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("react-router") || id.includes("react-dom") || id.includes("react")) return "react";
          return "vendor";
        },
      },
    },
  },
})
