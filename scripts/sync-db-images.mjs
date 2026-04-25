import { MongoClient } from "mongodb";

// Mirror of the in-code Cloudinary URL constants from
//   client/src/pages/category-selection.tsx
//   client/src/pages/menu-landing.tsx
const C = (path) => `https://res.cloudinary.com/dui1jsojt/image/upload/${path}`;

// --- subcategory images (final overrides applied) ---
const subcategoryImages = {
  // mocktails
  "signature-mocktails":  C("v1777092737/tarang-assets/image_1765865243299.png"),
  "soft-beverages":       C("v1777092736/tarang-assets/image_1765865174044.png"),
  "mocktails-drinks":     C("v1777092737/tarang-assets/image_1765865243299.png"),

  // bar — top-level overrides
  "cocktails":            C("v1777093047/tarang-assets/image_1776838373181.jpg"),
  "shots":                C("v1777093048/tarang-assets/image_1776838419227.jpg"),
  "beer":                 C("v1777093049/tarang-assets/image_1776838494451.jpg"),
  "alcopops":             C("v1777093049/tarang-assets/image_1776838532614.png"),
  "wine":                 C("v1777093050/tarang-assets/image_1776838566790.jpg"),
  "liquor":               C("v1777093054/tarang-assets/image_1776838776054.jpg"),
  "beverages":            C("v1777093052/tarang-assets/image_1776838668811.png"),
  "whisky":               C("v1777093051/tarang-assets/image_1776838621162.jpg"),
  "single-malt":          C("v1777093052/tarang-assets/image_1776838685584.jpg"),
  "bourbon-irish":        C("v1777093053/tarang-assets/image_1776838705753.jpg"),
  "vodka":                C("v1777093054/tarang-assets/image_1776838821499.jpg"),
  "gin":                  C("v1777093055/tarang-assets/image_1776838846551.jpg"),
  "rum":                  C("v1777093056/tarang-assets/image_1776838895112.jpg"),
  "brandy":               C("v1777093057/tarang-assets/image_1776838913496.jpg"),
  "tequila":              C("v1777093048/tarang-assets/image_1776838419227.jpg"),
  "cognac-brandy":        C("v1777093057/tarang-assets/image_1776838913496.jpg"),
  "liqueurs":             C("v1777093049/tarang-assets/image_1776838532614.png"),

  "blended-whisky":       C("v1777093051/tarang-assets/image_1776838621162.jpg"),
  "blended-scotch-whisky":C("v1777093054/tarang-assets/image_1776838776054.jpg"),
  "american-irish-whiskey":C("v1777093053/tarang-assets/image_1776838705753.jpg"),
  "single-malt-whisky":   C("v1777093052/tarang-assets/image_1776838685584.jpg"),

  // wine sub-types
  "sparkling-wine":       C("v1777092728/tarang-assets/image_1765864313974.png"),
  "white-wines":          C("v1777092729/tarang-assets/image_1765864338087.png"),
  "rose-wines":           C("v1777092732/tarang-assets/image_1765864363438.png"),
  "red-wines":            C("v1777092733/tarang-assets/image_1765864393053.png"),
  "dessert-wines":        C("v1777092734/tarang-assets/image_1765864417149.png"),
  "port-wine":            C("v1777092735/tarang-assets/image_1765864441224.png"),

  // food (final overrides)
  "soups":                C("v1777092689/tarang-assets/image_1765861784186.png"),
  "khane-peene":          C("v1777092773/tarang-assets/image_1776748663858.jpg"),
  "continental-veg":      C("v1777092774/tarang-assets/image_1776748745623.jpg"),
  "continental-non-veg":  C("v1777092775/tarang-assets/image_1776748813278.jpg"),
  "pasta":                C("v1777092776/tarang-assets/image_1776750646640.jpg"),
  "pizza":                C("v1777092777/tarang-assets/image_1776750693771.jpg"),
  "tandoor-veg":          C("v1777092778/tarang-assets/image_1776750775671.jpg"),
  "tandoor-non-veg":      C("v1777092778/tarang-assets/image_1776750952941.jpg"),
  "oriental-starter-veg": C("v1777094099/tarang-assets/image_1777093958837.jpg"),
  "oriental-starter-non-veg": C("v1777092779/tarang-assets/image_1776751007687.jpg"),
  "jalpari-special":      C("v1777093026/tarang-assets/image_1776758250780.jpg"),
  "sabzi-tarkari":        C("v1777093026/tarang-assets/image_1776758310412.jpg"),
  "murg-e-khaas":         C("v1777093024/tarang-assets/image_1776757099680.jpg"),
  "gosht-e-khaas":        C("v1777093025/tarang-assets/image_1776757268424.jpg"),
  "agri-style":           C("v1777092784/tarang-assets/image_1776753039521.jpg"),
  "rotis":                C("v1777092785/tarang-assets/image_1776757042346.jpg"),
  "oriental-curries":     C("v1777092783/tarang-assets/image_1776752871724.jpg"),
  "fried-rice-noodles":   C("v1777092784/tarang-assets/image_1776752946394.jpg"),
  "basmati-ki-khushbu":   C("v1777092781/tarang-assets/image_1776752661151.jpg"),
  "dals":                 C("v1777092782/tarang-assets/image_1776752707773.jpg"),
  "salad-raita":          C("v1777092780/tarang-assets/image_1776752436882.jpg"),
  "desserts":             C("v1777092781/tarang-assets/image_1776752566455.jpg"),
};

// --- main-category images (from menu-landing.tsx) ---
const categoryImages = {
  food:        C("v1777093036/tarang-assets/image_1776832578996.jpg"),
  bar:         C("v1777093036/tarang-assets/image_1776832765185.jpg"),
  mocktails:   C("v1777093037/tarang-assets/image_1776833112037.jpg"),
  desserts:    C("v1777092781/tarang-assets/image_1776752566455.jpg"),
  cocktails:   C("v1777092668/tarang-assets/COCKTAILS_1766751289781.jpg"),
  "crafted-beer": C("v1777092668/tarang-assets/CRAFTED_BEER_1766750491358.jpg"),
};

const FALLBACK = C("v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg");

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const cats = await client.db("menupage").collection("categories").find({}).toArray();

let totalUpdated = 0;
let mainSet = 0, subSet = 0, missingMappings = [];

function applyImage(sub) {
  const img = subcategoryImages[sub.id] || FALLBACK;
  if (!subcategoryImages[sub.id]) missingMappings.push(sub.id);
  if (sub.image !== img) {
    sub.image = img;
    return true;
  }
  return false;
}

for (const cat of cats) {
  let modified = false;

  const catImg = categoryImages[cat.id] || FALLBACK;
  if (cat.image !== catImg) {
    cat.image = catImg;
    modified = true;
    mainSet++;
  }

  const walk = (subs) => {
    for (const sub of subs || []) {
      if (applyImage(sub)) { modified = true; subSet++; }
      if (sub.subcategories?.length) walk(sub.subcategories);
    }
  };
  walk(cat.subcategories);

  if (modified) {
    await client.db("menupage").collection("categories").updateOne(
      { _id: cat._id },
      { $set: { image: cat.image, subcategories: cat.subcategories } },
    );
    totalUpdated++;
    console.log(`Updated ${cat.id}`);
  }
}

console.log(`\nDone. Main category images set: ${mainSet}`);
console.log(`Subcategory images set: ${subSet}`);
console.log(`Top-level docs updated: ${totalUpdated}`);
if (missingMappings.length) {
  console.log(`\nSubcategory IDs without an explicit mapping (used fallback):`);
  for (const id of missingMappings) console.log(`  - ${id}`);
}

await client.close();
