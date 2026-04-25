import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();

const hamburgerDb = client.db("hamburger");

// 1. Update sociallinks: replace barrelborn instagram + email
const links = await hamburgerDb.collection("sociallinks").findOne({});
if (links) {
  const update = {};
  if (links.instagram?.includes("barrelborn")) {
    update.instagram = "https://www.instagram.com/tarangkitchenandbar/";
  }
  if (links.email?.includes("barrelborn")) {
    update.email = "mailto:tarang.hospitality@gmail.com";
  }
  if (Object.keys(update).length) {
    await hamburgerDb.collection("sociallinks").updateOne({ _id: links._id }, { $set: update });
    console.log("Updated sociallinks:", update);
  } else {
    console.log("sociallinks already clean");
  }
}

// 2. Update restaurantinfo: replace any "Barrelborn" text and "@barrelborn_" handle
const info = await hamburgerDb.collection("restaurantinfo").findOne({});
if (info) {
  const update = {};
  const fields = ["location", "instagram", "facebook", "youtube"];
  for (const f of fields) {
    if (info[f]?.name && /barrelborn/i.test(info[f].name)) {
      const newName = info[f].name
        .replace(/@barrelborn_?/gi, "@tarangkitchenandbar")
        .replace(/Barrelborn/gi, f === "location" ? "Tarang Kitchen & Bar" : "Tarang Kitchen and Bar");
      update[f] = { ...info[f], name: newName };
    }
  }
  if (Object.keys(update).length) {
    await hamburgerDb.collection("restaurantinfo").updateOne({ _id: info._id }, { $set: update });
    console.log("Updated restaurantinfo:", update);
  } else {
    console.log("restaurantinfo already clean");
  }
}

await client.close();
console.log("Done");
