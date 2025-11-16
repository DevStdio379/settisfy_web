import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	base: '/', // ✅ IMPORTANT for Netlify
	plugins: [react()],
	define: { "process.env": {} },
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
});
