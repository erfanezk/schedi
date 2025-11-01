#!/usr/bin/env node

import { existsSync } from "fs";
import { join } from "path";

console.log("Testing @schedi/core package build...\n");

try {
  // Verify build output
  console.log("✅ Verifying build output...");
  const distExists = existsSync("dist");
  const indexJsExists = existsSync(join("dist", "index.js"));
  const indexCjsExists = existsSync(join("dist", "index.cjs"));
  const indexDtsExists = existsSync(join("dist", "index.d.ts"));

  if (distExists && indexJsExists && indexCjsExists && indexDtsExists) {
    console.log("🎉 Build successful!");
  } else {
    console.error("❌ Build failed - missing required files");
    if (!indexJsExists) console.error("  - Missing: dist/index.js");
    if (!indexCjsExists) console.error("  - Missing: dist/index.cjs");
    if (!indexDtsExists) console.error("  - Missing: dist/index.d.ts");
    process.exit(1);
  }
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
