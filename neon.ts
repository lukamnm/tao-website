import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  // Declare your Neon services here
  preview: {
    // Browser origins allowed to open Realtime subscriptions (add the Vercel / production hosts when known)
    realtime: { allowedOrigins: ["http://localhost:3000", "http://127.0.0.1:3000"] },
  },
  auth: true,
  // aiGateway: true, // not served on the Free plan: re-enable after upgrading the org plan, then `neon deploy`
  functions: {
    hello: { name: "Hello World", source: "./hello.ts" },
  },
  buckets: {
    // "private" is the default; use "public_read" for anonymous reads
    assets: { access: "private" },
  },
  // Branch policy: per-branch tuning
  branch: (branch) => {
    if (branch.isDefault) {
      // Default branch: no overrides, uses project defaults
      return {};
    }
    if (!branch.exists) {
      // New non-default branches: auto-expire
      // Run `neon checkout <name>` to create a new branch with these settings
      return { ttl: "7d" };
    }
    // Existing branch: no changes
    return {};
  },
});
