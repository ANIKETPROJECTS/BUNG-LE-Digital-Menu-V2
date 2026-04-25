import { readFileSync, writeFileSync } from "fs";
import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from "mongodb";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const OLD_FOLDER = "barrelborn-assets";
const NEW_FOLDER = "tarang-assets";
const MAPPING_FILE = "scripts/cloudinary-mapping.json";

const mapping = JSON.parse(readFileSync(MAPPING_FILE, "utf8"));

console.log(`Renaming ${Object.keys(mapping).length} assets from ${OLD_FOLDER}/ to ${NEW_FOLDER}/...`);

const newMapping = {};
let renamed = 0;
let failed = 0;

for (const [filename, oldUrl] of Object.entries(mapping)) {
  const m = oldUrl.match(/\/upload\/v\d+\/([^?]+?)\.(\w+)$/);
  if (!m) {
    console.error("Cannot parse URL:", oldUrl);
    failed++;
    newMapping[filename] = oldUrl;
    continue;
  }
  const oldPublicId = m[1];
  const ext = m[2];
  const newPublicId = oldPublicId.replace(`${OLD_FOLDER}/`, `${NEW_FOLDER}/`);

  try {
    const result = await cloudinary.uploader.rename(oldPublicId, newPublicId, {
      overwrite: true,
      invalidate: true,
    });
    newMapping[filename] = result.secure_url;
    renamed++;
    if (renamed % 20 === 0) {
      console.log(`  [${renamed}] ${filename}`);
      writeFileSync(MAPPING_FILE, JSON.stringify(newMapping, null, 2));
    }
  } catch (err) {
    if (err.message?.includes("not found") || err.error?.http_code === 404) {
      newMapping[filename] = oldUrl;
      console.log(`  Skipped (already moved or missing): ${filename}`);
    } else {
      console.error(`  FAILED ${filename}: ${err.message}`);
      newMapping[filename] = oldUrl;
      failed++;
    }
  }
}

writeFileSync(MAPPING_FILE, JSON.stringify(newMapping, null, 2));
console.log(`\nRenamed: ${renamed}, Failed: ${failed}`);

console.log("\nUpdating MongoDB references...");
const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const db = client.db("menupage");
const cats = await db.collection("categories").find({}).toArray();
let dbUpdates = 0;
for (const cat of cats) {
  let modified = false;
  if (cat.image && cat.image.includes(OLD_FOLDER)) {
    cat.image = cat.image.replace(`/${OLD_FOLDER}/`, `/${NEW_FOLDER}/`);
    modified = true;
  }
  for (const sub of cat.subcategories || []) {
    if (sub.image && sub.image.includes(OLD_FOLDER)) {
      sub.image = sub.image.replace(`/${OLD_FOLDER}/`, `/${NEW_FOLDER}/`);
      modified = true;
    }
  }
  if (modified) {
    await db.collection("categories").updateOne(
      { _id: cat._id },
      { $set: { image: cat.image, subcategories: cat.subcategories } },
    );
    dbUpdates++;
  }
}
console.log(`MongoDB category docs updated: ${dbUpdates}`);
await client.close();

console.log("\nDone. Now run: node scripts/replace-barrelborn-urls.mjs");
