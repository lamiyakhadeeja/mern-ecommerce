import "../loadEnv.js";
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";

const ELECTRONICS_CATEGORIES = [
  { name: "Phones", slug: "phones", description: "Smartphones and mobile devices", sortOrder: 1 },
  { name: "Laptops", slug: "laptops", description: "Notebooks, ultrabooks, and Chromebooks", sortOrder: 2 },
  { name: "Accessories", slug: "accessories", description: "Cases, chargers, cables, audio, and more", sortOrder: 3 },
];

async function seed() {
  await connectDB();
  for (const c of ELECTRONICS_CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: c.slug },
      { name: c.name, description: c.description, sortOrder: c.sortOrder },
      { upsert: true, new: true }
    );
    console.log(`Category ready: ${c.slug}`);
  }
  console.log("Electronics categories seeded.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
