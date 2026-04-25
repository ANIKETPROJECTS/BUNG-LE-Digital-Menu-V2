import { MongoClient } from "mongodb";

const C = (path) => `https://res.cloudinary.com/dui1jsojt/image/upload/${path}`;

// Cloudinary URLs by subcategory id (mirror of category-selection.tsx)
const subcategoryImages = {
  "signature-mocktails":  C("v1777092737/tarang-assets/image_1765865243299.png"),
  "soft-beverages":       C("v1777092736/tarang-assets/image_1765865174044.png"),
  "mocktails-drinks":     C("v1777092737/tarang-assets/image_1765865243299.png"),

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

  "sparkling-wine":       C("v1777092728/tarang-assets/image_1765864313974.png"),
  "white-wines":          C("v1777092729/tarang-assets/image_1765864338087.png"),
  "rose-wines":           C("v1777092732/tarang-assets/image_1765864363438.png"),
  "red-wines":            C("v1777092733/tarang-assets/image_1765864393053.png"),
  "dessert-wines":        C("v1777092734/tarang-assets/image_1765864417149.png"),
  "port-wine":            C("v1777092735/tarang-assets/image_1765864441224.png"),

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

  // legacy from menu-landing/category-selection
  "nibbles":              C("v1777092740/tarang-assets/image_1767537969124.png"),
  "titbits":              C("v1777092741/tarang-assets/image_1767538122517.png"),
  "salads":               C("v1777092743/tarang-assets/image_1767538266582.png"),
  "starters":             C("v1777092691/tarang-assets/image_1765862083770.png"),
  "charcoal":             C("v1777092745/tarang-assets/image_1767539363565.png"),
  "sliders":              C("v1777092749/tarang-assets/image_1767539763570.png"),
  "entree":               C("v1777092752/tarang-assets/image_1767540494821.png"),
  "bao-dimsum":           C("v1777092752/tarang-assets/image_1767540547633.png"),
  "curries":              C("v1777092761/tarang-assets/image_1767544842804.png"),
  "biryani":              C("v1777092753/tarang-assets/image_1767540755506.png"),
  "rice":                 C("v1777092708/tarang-assets/image_1765862832303.png"),
  "breads":               C("v1777092756/tarang-assets/image_1767540967353.png"),
  "asian-mains":          C("v1777092757/tarang-assets/image_1767544426904.png"),
  "thai-bowls":           C("v1777092758/tarang-assets/image_1767544482541.png"),
  "rice-noodles":         C("v1777092760/tarang-assets/image_1767544566928.png"),
  "continental":          C("v1777092746/tarang-assets/image_1767539626901.png"),
  "mangalorean-style":    C("v1777092744/tarang-assets/image_1767538398708.png"),
  "wok":                  C("v1777092757/tarang-assets/image_1767544426904.png"),
  "artisan-pizzas":       C("v1777092777/tarang-assets/image_1776750693771.jpg"),
  "mini-burger-sliders":  C("v1777092749/tarang-assets/image_1767539763570.png"),
  "indian-mains-curries": C("v1777092761/tarang-assets/image_1767544842804.png"),
  "biryanis-rice":        C("v1777092753/tarang-assets/image_1767540755506.png"),
  "rice-with-curry---thai-asian-bowls": C("v1777092758/tarang-assets/image_1767544482541.png"),
  "sizzlers":             C("v1777092772/tarang-assets/image_1771582754596.jpg"),
  "pint-beers":           C("v1777093083/tarang-assets/pint_beer_1766834179092.png"),
  "craft-beers-on-tap":   C("v1777092669/tarang-assets/Craftbeerontap_1766834179093.png"),
  "draught-beer":         C("v1777092671/tarang-assets/Draught_beer-min_1766834686357.png"),
  "sangria":              C("v1777092762/tarang-assets/image_1767545808245.png"),
  "classic-cocktails":    C("v1777092763/tarang-assets/image_1767545845465.png"),
  "signature-cocktails":  C("v1777092771/tarang-assets/image_1767546048894.png"),
  "wine-cocktails":       C("v1777092764/tarang-assets/image_1767545904457.png"),
  "signature-shots":      C("v1777092767/tarang-assets/image_1767545936498.png"),
  "beer-cocktail":        C("v1777092680/tarang-assets/beer_cocktail_1768238826587.jpg"),
};

const FALLBACK = C("v1777092683/tarang-assets/coming_soon_imagev2_1766811809828.jpg");

// Map collection name → subcategory image lookup key
function imgForCollection(name) {
  if (subcategoryImages[name]) return subcategoryImages[name];
  // Aliases for Mongo collection names that contain awkward chars
  const aliases = {
    "bao-&-dim-sum":               "bao-dimsum",
    "rice-&-noodles":              "rice-noodles",
    "rice-with-curry---thai-&-asian-bowls": "rice-with-curry---thai-asian-bowls",
    "indian-mains---curries":      "indian-mains-curries",
    "entree-(main-course)":        "entree",
  };
  return subcategoryImages[aliases[name]] || FALLBACK;
}

// --- Price + description parser ---
// Splits combined "30ml ₹570 / 60ml ₹1050 / ..." into:
//   description = "30ml / 60ml / ..."
//   price       = "570 / ₹1050 / ₹..." (₹ omitted on first)
// Only touches items where every segment matches the qty+price pattern.
const SEG = /^\s*(\d+(?:\.\d+)?\s*(?:ml|cl|l|gm|gms|g|kg|pc|pcs|piece|pieces|pieces?)?)\s*₹\s*(\d+(?:\.\d+)?)\s*$/i;

function parseSizedPrice(rawPrice) {
  if (rawPrice == null) return null;
  const s = String(rawPrice).trim();
  if (!s.includes("₹")) return null;
  const segments = s.split("/").map(x => x.trim()).filter(Boolean);
  if (segments.length < 2) return null;
  const sizes = [];
  const prices = [];
  for (const seg of segments) {
    const m = seg.match(SEG);
    if (!m) return null;
    sizes.push(m[1].trim());
    prices.push(m[2]);
  }
  const description = sizes.join(" / ");
  const price = prices.map((p, i) => (i === 0 ? p : `₹${p}`)).join(" / ");
  return { description, price };
}

// Normalises an already-correctly-split price like " 150 / ₹250 / ..." (extra space)
function normaliseAlreadySplitPrice(rawPrice) {
  if (rawPrice == null) return null;
  const original = String(rawPrice);
  const s = original.trim();
  if (!s.includes("/") || !s.includes("₹")) return null;
  const segments = s.split("/").map(x => x.trim()).filter(Boolean);
  if (segments.length < 2) return null;
  const nums = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    let m;
    if (i === 0) {
      m = seg.match(/^₹?\s*(\d+(?:\.\d+)?)$/);
    } else {
      m = seg.match(/^₹\s*(\d+(?:\.\d+)?)$/);
    }
    if (!m) return null;
    nums.push(m[1]);
  }
  const normalised = nums.map((p, i) => (i === 0 ? p : `₹${p}`)).join(" / ");
  return normalised === original ? null : normalised;
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db("barrelborn");
const cols = (await db.listCollections().toArray()).map(c => c.name);

let total = 0, parsedSplits = 0, normalised = 0, imgUpdates = 0, untouched = 0;
const samples = [];

for (const cname of cols) {
  if (cname === "system.indexes") continue;
  const items = await db.collection(cname).find({}).toArray();
  const collectionImg = imgForCollection(cname);
  for (const it of items) {
    total++;
    const update = {};

    // Split combined "30ml ₹X / ..." price into description + price
    const split = parseSizedPrice(it.price);
    if (split) {
      const noDesc = !it.description || String(it.description).trim() === "";
      if (noDesc || /\d+\s*(?:ml|cl|l|gm|g|kg|pc|pcs)\s*₹/i.test(String(it.description))) {
        update.description = split.description;
        update.price = split.price;
        parsedSplits++;
        if (samples.length < 5) samples.push({ col: cname, name: it.name, before: it.price, afterDesc: split.description, afterPrice: split.price });
      }
    } else {
      // try normaliser for already-split prices with stray spaces
      const norm = normaliseAlreadySplitPrice(it.price);
      if (norm) { update.price = norm; normalised++; }
    }

    // Image: ensure every item has a Cloudinary URL.
    // Replace anything that isn't already a Cloudinary URL with the subcategory image.
    const currentImg = it.image ? String(it.image) : "";
    const isCloudinary = /res\.cloudinary\.com/.test(currentImg);
    if (!isCloudinary) {
      update.image = collectionImg;
      imgUpdates++;
    }

    if (Object.keys(update).length === 0) { untouched++; continue; }
    await db.collection(cname).updateOne({ _id: it._id }, { $set: update });
  }
}

console.log(`Items scanned:       ${total}`);
console.log(`Price→split applied: ${parsedSplits}`);
console.log(`Price normalised:    ${normalised}`);
console.log(`Image URL set:       ${imgUpdates}`);
console.log(`Untouched:           ${untouched}`);
console.log(`\nSample transformations:`);
for (const s of samples) {
  console.log(`  [${s.col}] ${s.name}`);
  console.log(`    before price: ${JSON.stringify(s.before)}`);
  console.log(`    after  desc:  ${JSON.stringify(s.afterDesc)}`);
  console.log(`    after  price: ${JSON.stringify(s.afterPrice)}`);
}

await client.close();
