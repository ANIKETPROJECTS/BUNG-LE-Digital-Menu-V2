import { MongoClient, ObjectId } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI is required");

const client = new MongoClient(MONGODB_URI);
await client.connect();

const menuPageDb  = client.db("menupage");
const bungleDb    = client.db("bungle");
const catsCol     = menuPageDb.collection("categories");
const restaurantId = new ObjectId("6874cff2a880250859286de6");
const now = new Date();

// ── Category slug mapping ─────────────────────────────────────────────────
// title → { id (slug used as collection name in bungle), items, isVeg map }
const categoryMap = [
  {
    title: "Non-Veg Rice & Non-Veg Special Rice",
    id: "nonveg-rice",
    items: [
      { name: "Egg Fried Rice",                          isVeg: false },
      { name: "Chi Fried Rice",                          isVeg: false },
      { name: "Chi Fried Rice No Egg",                   isVeg: false },
      { name: "Egg Schezwan Rice",                       isVeg: false },
      { name: "Chi Schezwan Rice",                       isVeg: false },
      { name: "Chi Schezwan Rice No Egg",                isVeg: false },
      { name: "Egg Triple Schezwan Rice With Gravy",     isVeg: false },
      { name: "Chi Triple Schezwan Rice With Gravy",     isVeg: false },
      { name: "Chi Munchurian Fried Rice With Gravy",    isVeg: false },
      { name: "Chi Hong Kong Rice",                      isVeg: false },
      { name: "Chi Singapore Rice",                      isVeg: false },
      { name: "Chi Combination Rice",                    isVeg: false },
      { name: "Chi Chilly Rice With Gravy",              isVeg: false },
      { name: "Chi Sismi Chilly Rice",                   isVeg: false },
      { name: "Chi Fortune Rice With Gravy",             isVeg: false },
      { name: "Chi Chopper Rice With Gravy",             isVeg: false },
      { name: "Chi Sherpa Rice With Gravy",              isVeg: false },
      { name: "Chi Packing Rice With Gravy",             isVeg: false },
      { name: "Chi Hotrate Rice With Dry Gravy",         isVeg: false },
      { name: "Chi Hunan Rice With Dry Gravy",           isVeg: false },
      { name: "Chi Thousand Rice With Gravy",            isVeg: false },
      { name: "Chi Boxer Rice With Gravy",               isVeg: false },
    ],
  },
  {
    title: "Soup & Veg Starters",
    id: "soup-veg-starters",
    items: [
      { name: "Manchow Soup",                  isVeg: true },
      { name: "Clear Soup",                    isVeg: true },
      { name: "Schezwan Soup",                 isVeg: true },
      { name: "Hot & Sour Soup",               isVeg: true },
      { name: "Tomyom Soup",                   isVeg: true },
      { name: "Sweet Corn Soup",               isVeg: true },
      { name: "Royal Soup",                    isVeg: true },
      { name: "Lemon Coriander Soup",          isVeg: true },
      { name: "Golden Ginger Soup",            isVeg: true },
      { name: "Cream of Tomato Soup",          isVeg: true },
      { name: "Crispy Potato",                 isVeg: true },
      { name: "Honey Crispy Potato",           isVeg: true },
      { name: "Paneer Chilly Dry / Gravy",     isVeg: true },
      { name: "Veg Manchurian Dry / Gravy",    isVeg: true },
      { name: "Paneer Manchurian Dry / Gravy", isVeg: true },
      { name: "Paneer Schezwan Dry / Gravy",   isVeg: true },
      { name: "Paneer Salt and Pepper",        isVeg: true },
      { name: "Mushroom Chilly",               isVeg: true },
      { name: "Paneer Butter Garlic",          isVeg: true },
      { name: "Paneer Kung Pao",               isVeg: true },
      { name: "Paneer 65",                     isVeg: true },
      { name: "Soyabeen Chilly Dry / Gravy",   isVeg: true },
      { name: "Paneer Shanghai",               isVeg: true },
      { name: "Paneer Hunan",                  isVeg: true },
      { name: "Paneer Hotrate",                isVeg: true },
    ],
  },
  {
    title: "Non-Veg Starters, Veg Appetizers & Non-Veg Appetizers",
    id: "nonveg-starters-appetizers",
    items: [
      { name: "Chicken Chilly Dry / Gravy",                 isVeg: false },
      { name: "Chicken Manchurian Dry / Gravy",             isVeg: false },
      { name: "Chicken Schezwan Dry / Gravy",               isVeg: false },
      { name: "Chicken Lollypop Full Masala Dry (6 pieces)",isVeg: false },
      { name: "Chicken Hunan",                              isVeg: false },
      { name: "Chicken 65",                                 isVeg: false },
      { name: "Butter Garlic Chicken",                      isVeg: false },
      { name: "Chicken Kung Pao",                           isVeg: false },
      { name: "Roasted Chilly Chicken Dry",                 isVeg: false },
      { name: "Chicken Shanghai",                           isVeg: false },
      { name: "Chicken Hotrate",                            isVeg: false },
      { name: "French Fries",                               isVeg: true  },
      { name: "Peri Peri French Fries",                     isVeg: true  },
      { name: "Veg Spring Roll",                            isVeg: true  },
      { name: "Paneer Spring Roll",                         isVeg: true  },
      { name: "Chicken Golden Finger",                      isVeg: false },
      { name: "Chicken Koliwada",                           isVeg: false },
      { name: "Chi Spring Roll",                            isVeg: false },
      { name: "Butter Fry Chicken",                         isVeg: false },
    ],
  },
  {
    title: "Non-Veg Special Noodle, Veg Rice & Veg Special Rice",
    id: "nonveg-noodle-veg-rice",
    items: [
      { name: "Chi Sismi Chilly Noodle With Gravy",         isVeg: false },
      { name: "Chi Hotrate Noodle With Dry Gravy",          isVeg: false },
      { name: "Chi Thousand Noodle With Gravy",             isVeg: false },
      { name: "Chi Hunan Noodle With Dry Gravy",            isVeg: false },
      { name: "Veg Fried Rice",                             isVeg: true  },
      { name: "Veg Schezwan Rice",                          isVeg: true  },
      { name: "Veg Triple Schezwan Rice With Gravy",        isVeg: true  },
      { name: "Veg Combination Rice",                       isVeg: true  },
      { name: "Veg Singapore Rice",                         isVeg: true  },
      { name: "Veg Manchurian Rice With Gravy",             isVeg: true  },
      { name: "Veg Chilly Rice With Gravy",                 isVeg: true  },
      { name: "Paneer Fried Rice",                          isVeg: true  },
      { name: "Paneer Triple Rice",                         isVeg: true  },
      { name: "Paneer Manchurian Rice",                     isVeg: true  },
      { name: "Mushroom Fried Rice",                        isVeg: true  },
      { name: "Veg Sismi Chilly Rice",                      isVeg: true  },
      { name: "Veg Spicy Coriander Fried Rice",             isVeg: true  },
      { name: "Veg Fortune Rice With Gravy",                isVeg: true  },
      { name: "Veg Chopper Rice With Dry Gravy",            isVeg: true  },
      { name: "Veg Sherpa Rice With Gravy",                 isVeg: true  },
      { name: "Paneer Hotrate Rice With Thick Gravy",       isVeg: true  },
    ],
  },
];

// ── 1. Add `id` slug to each category document ────────────────────────────
console.log("Step 1: Setting id slugs on categories...");
for (const cat of categoryMap) {
  const res = await catsCol.updateOne(
    { title: cat.title },
    { $set: { id: cat.id } }
  );
  console.log(`  "${cat.title}" → id: "${cat.id}" (matched: ${res.matchedCount})`);
}

// ── 2. Remove previously inserted items from old collections ──────────────
const oldCollections = ["soups", "oriental-starter-veg", "oriental-starter-non-veg", "fried-rice-noodles"];
const allItemNames = categoryMap.flatMap(c => c.items.map(i => i.name.trim().toLowerCase()));

console.log("\nStep 2: Removing misplaced items from old collections...");
for (const colName of oldCollections) {
  const col = bungleDb.collection(colName);
  const existing = await col.find({}, { projection: { name: 1 } }).toArray();
  const toDelete = existing
    .filter(d => allItemNames.includes(d.name.trim().toLowerCase()))
    .map(d => d._id);
  if (toDelete.length) {
    await col.deleteMany({ _id: { $in: toDelete } });
    console.log(`  [${colName}] Deleted ${toDelete.length} items`);
  } else {
    console.log(`  [${colName}] Nothing to delete`);
  }
}

// ── 3. Insert items into correct new collections ──────────────────────────
console.log("\nStep 3: Inserting items into correct category collections...");
for (const cat of categoryMap) {
  const col = bungleDb.collection(cat.id);
  const existing = await col.find({}, { projection: { name: 1 } }).toArray();
  const existingNames = new Set(existing.map(d => d.name.trim().toLowerCase()));

  const toInsert = cat.items
    .filter(i => !existingNames.has(i.name.trim().toLowerCase()))
    .map(i => ({
      name: i.name,
      description: "",
      price: 0,
      category: cat.id,
      isVeg: i.isVeg,
      image: "",
      restaurantId,
      isAvailable: true,
      todaysSpecial: false,
      chefSpecial: false,
      createdAt: now,
      updatedAt: now,
      __v: 0,
    }));

  if (toInsert.length) {
    await col.insertMany(toInsert);
    console.log(`  [${cat.id}] Inserted ${toInsert.length} / ${cat.items.length} items`);
  } else {
    console.log(`  [${cat.id}] All ${cat.items.length} items already present`);
  }
}

await client.close();
console.log("\nDone.");
