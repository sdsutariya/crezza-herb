import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

async function removeNearSolidBackground(input, target, threshold = 28) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const [tr, tg, tb] = target;

  for (let i = 0; i < data.length; i += 4) {
    const diff =
      Math.abs(data[i] - tr) +
      Math.abs(data[i + 1] - tg) +
      Math.abs(data[i + 2] - tb);

    if (diff <= threshold) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

function isForegroundPixel(r, g, b) {
  const greenLead = g - Math.max(r, b);
  if (greenLead >= 10 && g >= 40) return true;

  const min = Math.min(r, g, b);
  if (min >= 240) return false;

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 225 && greenLead > -5;
}

async function removeWhiteBackgroundBinary(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const keep = isForegroundPixel(r, g, b);
    data[i + 3] = keep ? 255 : 0;
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer();
}

async function buildTransparentIconFromLight(lightPath, outputPath) {
  const transparent = await removeWhiteBackgroundBinary(lightPath);
  await sharp(transparent).png().toFile(outputPath);
  return transparent;
}

const root = process.cwd();
const iconLight = path.join(root, "src/assets/crezzaherb-icon-light.png");
const iconTransparent = path.join(root, "src/assets/crezzaherb-icon-transparent.png");
const stacked = path.join(root, "src/assets/crezzaherb-logo-stacked.png");
const horizontal = path.join(root, "src/assets/crezzaherb-logo-horizontal.png");
const publicDir = path.join(root, "public");

await mkdir(publicDir, { recursive: true });
await mkdir(path.join(root, "src/assets"), { recursive: true });

const iconBuffer = await buildTransparentIconFromLight(iconLight, iconTransparent);

const faviconSizes = [16, 32, 48, 180, 512];
for (const size of faviconSizes) {
  const filename =
    size === 180
      ? "apple-touch-icon.png"
      : size === 512
        ? "icon-512.png"
        : `favicon-${size}x${size}.png`;

  await sharp(iconBuffer)
    .resize(size, size, {
      fit: "contain",
      kernel: sharp.kernel.lanczos3,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(publicDir, filename));
}

await sharp(iconBuffer)
  .resize(32, 32, {
    fit: "contain",
    kernel: sharp.kernel.lanczos3,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(path.join(publicDir, "favicon.png"));

await sharp(iconBuffer)
  .resize(48, 48, {
    fit: "contain",
    kernel: sharp.kernel.lanczos3,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(path.join(publicDir, "favicon.ico"));

const stackedTransparent = await removeNearSolidBackground(stacked, [255, 255, 255], 35);
const horizontalTransparent = await removeNearSolidBackground(horizontal, [0, 0, 0], 35);

await sharp(stackedTransparent).toFile(
  path.join(root, "src/assets/crezzaherb-logo-stacked-transparent.png"),
);
await sharp(horizontalTransparent).toFile(
  path.join(root, "src/assets/crezzaherb-logo-horizontal-transparent.png"),
);

const horizontalOnWhite = await sharp(horizontal)
  .flatten({ background: "#ffffff" })
  .png()
  .toBuffer();

await sharp(horizontalOnWhite).toFile(
  path.join(publicDir, "crezzaherb-logo-horizontal.png"),
);

const ogImage = await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 255, g: 255, b: 255, alpha: 1 },
  },
})
  .composite([
    {
      input: await sharp(horizontalOnWhite)
        .resize(900, null, { fit: "inside" })
        .png()
        .toBuffer(),
      gravity: "center",
    },
  ])
  .png()
  .toBuffer();

await sharp(ogImage).toFile(path.join(publicDir, "og-image.png"));

const meta = await sharp(iconTransparent).metadata();
console.log(
  `Transparent icon rebuilt from light source (${meta.width}x${meta.height}, hasAlpha: ${meta.hasAlpha}). Favicons generated (resize-only).`,
);
