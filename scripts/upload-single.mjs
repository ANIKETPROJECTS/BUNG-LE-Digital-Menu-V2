import { readFileSync, unlinkSync } from "fs";
import { basename, extname } from "path";
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from "mongodb";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const TARGET_MAX = 800 * 1024;

async function compressImage(buffer, ext) {
  if (buffer.length <= TARGET_MAX) return { buffer, format: ext.replace(".", "") };
  const meta = await sharp(buffer).metadata();
  if (ext === ".png" && meta.hasAlpha) {
    for (const q of [90, 80, 70, 60, 50, 40, 30]) {
      const out = await sharp(buffer).png({ quality: q, compressionLevel: 9, palette: true }).toBuffer();
      if (out.length <= TARGET_MAX) return { buffer: out, format: "png" };
    }
  }
  for (const q of [90, 85, 80, 75, 70, 65, 60, 55, 50]) {
    const out = await sharp(buffer).jpeg({ quality: q, mozjpeg: true }).toBuffer();
    if (out.length <= TARGET_MAX) return { buffer: out, format: "jpg" };
  }
  return { buffer, format: ext.replace(".", "") };
}

function uploadBuffer(buffer, publicId, format) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "barrelborn-assets", public_id: publicId, resource_type: "image", format, overwrite: true },
      (err, result) => (err ? reject(err) : resolve(result)),
    );
    stream.end(buffer);
  });
}

const file = process.argv[2];
const subcategoryId = process.argv[3];
if (!file || !subcategoryId) {
  console.error("Usage: node upload-single.mjs <file> <subcategoryId>");
  process.exit(1);
}

const ext = extname(file).toLowerCase();
const original = readFileSync(file);
const beforeKb = (original.length / 1024).toFixed(1);
const { buffer: compressed, format } = await compressImage(original, ext);
const afterKb = (compressed.length / 1024).toFixed(1);
const publicId = basename(file, extname(file)).replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 100);
const result = await uploadBuffer(compressed, publicId, format);
console.log(`Uploaded ${file}: ${beforeKb}KB -> ${afterKb}KB`);
console.log(`URL: ${result.secure_url}`);

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("menupage");
const updateRes = await db.collection("categories").updateOne(
  { "subcategories.id": subcategoryId },
  { $set: { "subcategories.$.image": result.secure_url } },
);
console.log(`MongoDB updated: matched=${updateRes.matchedCount}, modified=${updateRes.modifiedCount}`);
await client.close();

unlinkSync(file);
console.log(`Deleted local file: ${file}`);
