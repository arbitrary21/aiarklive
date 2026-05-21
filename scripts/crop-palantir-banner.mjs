import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = process.argv[2] ?? path.join(root, "public/images/palantir-source.png");
const outDir = path.join(root, "public/images");

const metadata = await sharp(src).metadata();
const width = metadata.width ?? 1024;
const height = metadata.height ?? 1024;

// Left gothic arch panel (red-box area in the sidebar mockup).
const bannerWidth = Math.floor(width * 0.34);
const bannerHeight = Math.floor(height * 0.52);
const bannerLeft = 0;
const bannerTop = Math.floor(height * 0.18);

await sharp(src)
  .extract({
    left: bannerLeft,
    top: bannerTop,
    width: Math.min(bannerWidth, width - bannerLeft),
    height: Math.min(bannerHeight, height - bannerTop),
  })
  .resize(360, 96, { fit: "cover", position: "left" })
  .webp({ quality: 88 })
  .toFile(path.join(outDir, "sidebar-banner.webp"));

// Square icon crop from the same left panel.
const iconSize = Math.floor(Math.min(bannerWidth, bannerHeight) * 0.95);

await sharp(src)
  .extract({
    left: bannerLeft,
    top: bannerTop,
    width: Math.min(iconSize, width - bannerLeft),
    height: Math.min(iconSize, height - bannerTop),
  })
  .resize(128, 128, { fit: "cover", position: "left" })
  .webp({ quality: 88 })
  .toFile(path.join(outDir, "logo-palantir.webp"));

console.log("Created sidebar-banner.webp and logo-palantir.webp");
