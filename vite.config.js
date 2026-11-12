import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import svgr from "vite-plugin-svgr"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: { exportType: "named", namedExport: "ReactComponent" },
      include: "**/*.svg*",
    }),
  ],
  resolve: {
    alias: [{ find: "~", replacement: "/src" }],
  },
})
