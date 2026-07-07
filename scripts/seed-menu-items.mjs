import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI is required");

const restaurantId = new ObjectId("6874cff2a880250859286de6");
const now = new Date();

const base = {
  description: "",
  price: 0,
  image: "",
  restaurantId,
  isAvailable: true,
  todaysSpecial: false,
  chefSpecial: false,
  createdAt: now,
  updatedAt: now,
  __v: 0,
};

// ── SOUPS (isVeg: true) ────────────────────────────────────────────────────
const soups = [
  "Manchow Soup",
  "Clear Soup",
  "Schezwan Soup",
  "Hot & Sour Soup",
  "Tomyom Soup",
  "Sweet Corn Soup",
  "Royal Soup",
  "Lemon Coriander Soup",
  "Golden Ginger Soup",
  "Cream of Tomato Soup",
].map((name) => ({ ...base, name, category: "soups", isVeg: true }));

// ── ORIENTAL STARTER VEG (isVeg: true) ────────────────────────────────────
const orientalVeg = [
  "Crispy Potato",
  "Honey Crispy Potato",
  "Paneer Chilly Dry / Gravy",
  "Veg Manchurian Dry / Gravy",
  "Paneer Manchurian Dry / Gravy",
  "Paneer Schezwan Dry / Gravy",
  "Paneer Salt and Pepper",
  "Mushroom Chilly",
  "Paneer Butter Garlic",
  "Paneer Kung Pao",
  "Paneer 65",
  "Soyabeen Chilly Dry / Gravy",
  "Paneer Shanghai",
  "Paneer Hunan",
  "Paneer Hotrate",
  "French Fries",
  "Peri Peri French Fries",
  "Veg Spring Roll",
  "Paneer Spring Roll",
].map((name) => ({ ...base, name, category: "oriental-starter-veg", isVeg: true }));

// ── ORIENTAL STARTER NON-VEG (isVeg: false) ───────────────────────────────
const orientalNonVeg = [
  "Chicken Chilly Dry / Gravy",
  "Chicken Manchurian Dry / Gravy",
  "Chicken Schezwan Dry / Gravy",
  "Chicken Lollypop Full Masala Dry (6 pieces)",
  "Chicken Hunan",
  "Chicken 65",
  "Butter Garlic Chicken",
  "Chicken Kung Pao",
  "Roasted Chilly Chicken Dry",
  "Chicken Shanghai",
  "Chicken Hotrate",
  "Chicken Golden Finger",
  "Chicken Koliwada",
  "Chi Spring Roll",
  "Butter Fry Chicken",
].map((name) => ({ ...base, name, category: "oriental-starter-non-veg", isVeg: false }));

// ── FRIED RICE & NOODLES ───────────────────────────────────────────────────
const friedRiceNonVeg = [
  "Egg Fried Rice",
  "Chi Fried Rice",
  "Chi Fried Rice No Egg",
  "Egg Schezwan Rice",
  "Chi Schezwan Rice",
  "Chi Schezwan Rice No Egg",
  "Egg Triple Schezwan Rice With Gravy",
  "Chi Triple Schezwan Rice With Gravy",
  "Chi Munchurian Fried Rice With Gravy",
  "Chi Hong Kong Rice",
  "Chi Singapore Rice",
  "Chi Combination Rice",
  "Chi Chilly Rice With Gravy",
  "Chi Sismi Chilly Rice",
  "Chi Fortune Rice With Gravy",
  "Chi Chopper Rice With Gravy",
  "Chi Sherpa Rice With Gravy",
  "Chi Packing Rice With Gravy",
  "Chi Hotrate Rice With Dry Gravy",
  "Chi Hunan Rice With Dry Gravy",
  "Chi Thousand Rice With Gravy",
  "Chi Boxer Rice With Gravy",
  // Non-veg noodles (Image 4)
  "Chi Sismi Chilly Noodle With Gravy",
  "Chi Hotrate Noodle With Dry Gravy",
  "Chi Thousand Noodle With Gravy",
  "Chi Hunan Noodle With Dry Gravy",
].map((name) => ({ ...base, name, category: "fried-rice-noodles", isVeg: false }));

const friedRiceVeg = [
  "Veg Fried Rice",
  "Veg Schezwan Rice",
  "Veg Triple Schezwan Rice With Gravy",
  "Veg Combination Rice",
  "Veg Singapore Rice",
  "Veg Manchurian Rice With Gravy",
  "Veg Chilly Rice With Gravy",
  "Paneer Fried Rice",
  "Paneer Triple Rice",
  "Paneer Manchurian Rice",
  "Mushroom Fried Rice",
  "Veg Sismi Chilly Rice",
  "Veg Spicy Coriander Fried Rice",
  "Veg Fortune Rice With Gravy",
  "Veg Chopper Rice With Dry Gravy",
  "Veg Sherpa Rice With Gravy",
  "Paneer Hotrate Rice With Thick Gravy",
].map((name) => ({ ...base, name, category: "fried-rice-noodles", isVeg: true }));

// ── INSERT ─────────────────────────────────────────────────────────────────
const client = new MongoClient(MONGODB_URI);
await client.connect();
const db = client.db("bungle");

async function insertItems(collectionName, items) {
  if (!items.length) return;
  const col = db.collection(collectionName);

  // Avoid duplicates — skip items whose name already exists
  const existing = await col.find({}, { projection: { name: 1 } }).toArray();
  const existingNames = new Set(existing.map((d) => d.name.trim().toLowerCase()));
  const toInsert = items.filter((i) => !existingNames.has(i.name.trim().toLowerCase()));

  if (!toInsert.length) {
    console.log(`  [${collectionName}] All ${items.length} items already exist — skipped.`);
    return;
  }
  const result = await col.insertMany(toInsert);
  console.log(`  [${collectionName}] Inserted ${result.insertedCount} / ${items.length} items (${items.length - toInsert.length} already existed).`);
}

console.log("Seeding menu items...");
await insertItems("soups", soups);
await insertItems("oriental-starter-veg", orientalVeg);
await insertItems("oriental-starter-non-veg", orientalNonVeg);
await insertItems("fried-rice-noodles", [...friedRiceNonVeg, ...friedRiceVeg]);

await client.close();
console.log("Done.");
