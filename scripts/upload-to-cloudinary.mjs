import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from "fs";
import { join, extname, basename } from "path";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ASSETS_DIR = "attached_assets";
const MAPPING_FILE = "scripts/cloudinary-mapping.json";
const FOLDER = "barrelborn-assets";

const TARGET_MIN = 500 * 1024;
const TARGET_MAX = 800 * 1024;

const IMAGE_EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

const existingMapping = existsSync(MAPPING_FILE)
  ? JSON.parse(readFileSync(MAPPING_FILE, "utf8"))
  : {};

async function compressImage(buffer, ext) {
  const size = buffer.length;
  if (size <= TARGET_MAX) return { buffer, format: ext.replace(".", "") };

  const isPng = ext === ".png";
  const meta = await sharp(buffer).metadata();
  const hasAlpha = meta.hasAlpha;

  if (isPng && hasAlpha) {
    for (const quality of [90, 80, 70, 60, 50, 40, 30, 20]) {
      const out = await sharp(buffer)
        .png({ quality, compressionLevel: 9, palette: true })
        .toBuffer();
      if (out.length <= TARGET_MAX) {
        return { buffer: out, format: "png" };
      }
    }
    let width = meta.width;
    while (width > 400) {
      width = Math.floor(width * 0.85);
      const out = await sharp(buffer)
        .resize({ width })
        .png({ quality: 70, compressionLevel: 9, palette: true })
        .toBuffer();
      if (out.length <= TARGET_MAX) return { buffer: out, format: "png" };
    }
    return { buffer, format: "png" };
  }

  for (const quality of [90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40]) {
    const out = await sharp(buffer).jpeg({ quality, mozjpeg: true }).toBuffer();
    if (out.length <= TARGET_MAX) {
      return { buffer: out, format: "jpg" };
    }
  }

  let width = meta.width;
  while (width > 400) {
    width = Math.floor(width * 0.85);
    const out = await sharp(buffer)
      .resize({ width })
      .jpeg({ quality: 75, mozjpeg: true })
      .toBuffer();
    if (out.length <= TARGET_MAX) return { buffer: out, format: "jpg" };
  }
  return { buffer, format: ext.replace(".", "") };
}

function uploadBuffer(buffer, publicId, format) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        public_id: publicId,
        resource_type: "image",
        format,
        overwrite: true,
        invalidate: true,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
    stream.end(buffer);
  });
}

async function main() {
  const all = readdirSync(ASSETS_DIR).filter((f) => {
    const fp = join(ASSETS_DIR, f);
    if (!statSync(fp).isFile()) return false;
    return IMAGE_EXTS.has(extname(f).toLowerCase());
  });

  console.log(`Found ${all.length} images to process.`);

  const mapping = { ...existingMapping };
  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of all) {
    if (mapping[file]) {
      skipped++;
      continue;
    }
    const fp = join(ASSETS_DIR, file);
    const ext = extname(file).toLowerCase();
    const original = readFileSync(fp);
    const beforeKb = (original.length / 1024).toFixed(1);

    try {
      const { buffer: compressed, format } = await compressImage(original, ext);
      const afterKb = (compressed.length / 1024).toFixed(1);

      const publicId = basename(file, extname(file))
        .replace(/[^A-Za-z0-9_-]/g, "_")
        .slice(0, 100);

      const result = await uploadBuffer(compressed, publicId, format);
      mapping[file] = result.secure_url;

      processed++;
      console.log(
        `[${processed}/${all.length}] ${file}: ${beforeKb}KB -> ${afterKb}KB (${format}) -> ${result.secure_url}`,
      );

      if (processed % 5 === 0) {
        writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
      }
    } catch (err) {
      failed++;
      console.error(`FAILED ${file}:`, err.message);
    }
  }

  writeFileSync(MAPPING_FILE, JSON.stringify(mapping, null, 2));
  console.log(
    `\nDone. Processed: ${processed}, Skipped (already uploaded): ${skipped}, Failed: ${failed}`,
  );
  console.log(`Mapping saved to ${MAPPING_FILE}`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
