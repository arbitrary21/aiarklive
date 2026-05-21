import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = process.argv[2] ?? path.join(root, "public/images/palantir-source.png");
const outDir = path.join(root, "public/images");

const metadata = await sharp(src).metadata();
const width = metadata.width ?? 1024;
const height = metadata.height ?? 1536;

// Palantir sits slightly above center in the source artwork.
const focusX = width * 0.5;
const focusY = height * 0.36;

const logoSize = Math.floor(Math.min(width, height) * 0.34);
const logoLeft = Math.max(0, Math.floor(focusX - logoSize / 2));
const logoTop = Math.max(0, Math.floor(focusY - logoSize / 2));

await sharp(src)
  .extract({
    left: logoLeft,
    top: logoTop,
    width: Math.min(logoSize, width - logoLeft),
    height: Math.min(logoSize, height - logoTop),
  })
  .resize(128, 128, { fit: "cover" })
  .webp({ quality: 88 })
  .toFile(path.join(outDir, "logo-palantir.webp"));

const bannerHeight = Math.floor(width * 0.42);
const bannerTop = Math.max(0, Math.floor(focusY - bannerHeight * 0.52));

await sharp(src)
  .extract({
    left: 0,
    top: bannerTop,
    width,
    height: Math.min(bannerHeight, height - bannerTop),
  })
  .resize(360, 96, { fit: "cover", position: "centre" })
  .webp({ quality: 88 })
  .toFile(path.join(outDir, "sidebar-banner.webp"));

console.log("Created logo-palantir.webp and sidebar-banner.webp");
