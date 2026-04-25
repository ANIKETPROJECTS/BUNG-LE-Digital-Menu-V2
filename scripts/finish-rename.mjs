import { writeFileSync, readFileSync } from "fs";
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

async function listAll(prefix) {
  let all = [];
  let cursor = undefined;
  do {
    const r = await cloudinary.api.resources({
      type: "upload",
      prefix,
      max_results: 500,
      next_cursor: cursor,
    });
    all = all.concat(r.resources);
    cursor = r.next_cursor;
  } while (cursor);
  return all;
}

const oldAssets = await listAll(OLD_FOLDER + "/");
console.log(`Remaining in ${OLD_FOLDER}/:`, oldAssets.length);

let renamed = 0;
for (const a of oldAssets) {
  const newId = a.public_id.replace(`${OLD_FOLDER}/`, `${NEW_FOLDER}/`);
  try {
    await cloudinary.uploader.rename(a.public_id, newId, { overwrite: true, invalidate: true });
    renamed++;
    if (renamed % 10 === 0) console.log(`  ${renamed}/${oldAssets.length}`);
  } catch (err) {
    console.error("Rename failed:", a.public_id, err.message);
  }
}
console.log(`Renamed ${renamed}/${oldAssets.length}`);

const finalAssets = await listAll(NEW_FOLDER + "/");
console.log(`Final count in ${NEW_FOLDER}/:`, finalAssets.length);

// Rebuild mapping by extracting the original filename portion from public_id
const oldMapping = JSON.parse(readFileSync("scripts/cloudinary-mapping.json", "utf8"));
const newMapping = { ...oldMapping };

const byPublicIdBase = new Map();
for (const a of finalAssets) {
  const base = a.public_id.replace(`${NEW_FOLDER}/`, "");
  byPublicIdBase.set(base, a.secure_url);
}

let updated = 0, missing = 0;
for (const [filename, oldUrl] of Object.entries(oldMapping)) {
  const m = oldUrl.match(/\/(?:barrelborn-assets|tarang-assets)\/([^.\/]+)\.\w+$/);
  if (!m) continue;
  const base = m[1];
  if (byPublicIdBase.has(base)) {
    newMapping[filename] = byPublicIdBase.get(base);
    if (oldUrl !== newMapping[filename]) updated++;
  } else {
    missing++;
  }
}

writeFileSync("scripts/cloudinary-mapping.json", JSON.stringify(newMapping, null, 2));
console.log(`Mapping updated: ${updated} URLs changed, ${missing} not found in tarang-assets`);

console.log("\nUpdating MongoDB...");
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

const carouselDocs = await db.collection("carousel").find({}).toArray();
for (const d of carouselDocs) {
  if (d.url && d.url.includes(OLD_FOLDER)) {
    await db.collection("carousel").updateOne(
      { _id: d._id },
      { $set: { url: d.url.replace(`/${OLD_FOLDER}/`, `/${NEW_FOLDER}/`) } },
    );
    console.log("Updated carousel doc:", d._id);
  }
}

const logoDoc = await db.collection("logo").findOne({});
if (logoDoc?.url?.includes(OLD_FOLDER)) {
  await db.collection("logo").updateOne(
    { _id: logoDoc._id },
    { $set: { url: logoDoc.url.replace(`/${OLD_FOLDER}/`, `/${NEW_FOLDER}/`) } },
  );
  console.log("Updated logo doc");
}

await client.close();
console.log("Done.");
