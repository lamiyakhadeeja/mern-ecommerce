import "../loadEnv.js";
import { connectDB } from "../config/db.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const ELECTRONICS_CATEGORIES = [
  { name: "Phones", slug: "phones", description: "Smartphones and mobile devices", sortOrder: 1 },
  { name: "Laptops", slug: "laptops", description: "Notebooks, ultrabooks, and Chromebooks", sortOrder: 2 },
  { name: "Accessories", slug: "accessories", description: "Cases, chargers, cables, audio, and more", sortOrder: 3 },
  { name: "Tablets", slug: "tablets", description: "iPads and Android tablets", sortOrder: 4 },
  { name: "Wearables", slug: "wearables", description: "Smartwatches and fitness trackers", sortOrder: 5 },
];

const SAMPLE_PRODUCTS = [
  // --- PHONES ---
  {
    slug: "iphone-15-pro",
    name: "iPhone 15 Pro",
    brand: "Apple",
    categorySlug: "phones",
    price: 999,
    description: "Aerospace-grade titanium design and A17 Pro chip.",
    images: ["/images/products/iphone-15-pro.png"],
    stock: 24,
    sku: "PH-IP15P",
  },
  {
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    categorySlug: "phones",
    price: 1199,
    description: "The ultimate Android experience with integrated S Pen and Galaxy AI.",
    images: ["/images/products/samsung-s24-ultra.png"],
    stock: 18,
    sku: "PH-S24U",
  },
  {
    slug: "google-pixel-8-pro",
    name: "Google Pixel 8 Pro",
    brand: "Google",
    categorySlug: "phones",
    price: 999,
    description: "The best of Google AI in a powerful, pro-grade phone.",
    images: ["https://images.unsplash.com/photo-1696429175928-793a1cdef1d3?q=80&w=800&auto=format&fit=crop"],
    stock: 15,
    sku: "PH-PXL8P",
  },
  {
    slug: "oneplus-12",
    name: "OnePlus 12",
    brand: "OnePlus",
    categorySlug: "phones",
    price: 799,
    description: "Fast and smooth with Hasselblad camera for mobile.",
    images: ["https://images.unsplash.com/photo-1711200021382-7f9ec3643775?q=80&w=800&auto=format&fit=crop"],
    stock: 12,
    sku: "PH-OP12",
  },
  {
    slug: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    categorySlug: "phones",
    price: 1099,
    description: "Professional imaging with Leica optical lenses.",
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800&auto=format&fit=crop"],
    stock: 10,
    sku: "PH-X14U",
  },

  // --- LAPTOPS ---
  {
    slug: "macbook-pro-m3",
    name: "MacBook Pro 14\" (M3)",
    brand: "Apple",
    categorySlug: "laptops",
    price: 1599,
    description: "Mind-blowing speed with the M3 chip and up to 22 hours of battery life.",
    images: ["/images/products/macbook-pro.png"],
    stock: 10,
    sku: "LP-MBP3",
  },
  {
    slug: "rog-zephyrus-g14",
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    categorySlug: "laptops",
    price: 1499,
    description: "A compact gaming powerhouse with a stunning AniMe Matrix display.",
    images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=800&auto=format&fit=crop"],
    stock: 10,
    sku: "LP-ROG14",
  },
  {
    slug: "hp-spectre-x360",
    name: "HP Spectre x360",
    brand: "HP",
    categorySlug: "laptops",
    price: 1399,
    description: "Versatile 2-in-1 design with an OLED touch display.",
    images: ["https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=800&auto=format&fit=crop"],
    stock: 8,
    sku: "LP-HPX360",
  },
  {
    slug: "lenovo-thinkpad-x1",
    name: "Lenovo ThinkPad X1 Carbon",
    brand: "Lenovo",
    categorySlug: "laptops",
    price: 1699,
    description: "The ultimate business laptop: thin, light, and mission-critical tough.",
    images: ["https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=800&auto=format&fit=crop"],
    stock: 15,
    sku: "LP-THINKX1",
  },
  {
    slug: "dell-xps-15",
    name: "Dell XPS 15",
    brand: "Dell",
    categorySlug: "laptops",
    price: 1799,
    description: "Powerful performance meets premium design in this high-end creator machine.",
    images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800&auto=format&fit=crop"],
    stock: 5,
    sku: "LP-XPS15",
  },

  // --- ACCESSORIES ---
  {
    slug: "sony-wh1000xm5",
    name: "Sony WH-1000XM5 Headphones",
    brand: "Sony",
    categorySlug: "accessories",
    price: 399,
    description: "Industry-leading noise cancellation and magnificent sound quality.",
    images: ["/images/products/sony-xm5.png"],
    stock: 40,
    sku: "ACC-XM5",
  },
  {
    slug: "logitech-mx-master-3s",
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    categorySlug: "accessories",
    price: 99,
    description: "Quiet clicks and 8k DPI tracking on any surface.",
    images: ["https://images.unsplash.com/photo-1625773453127-4402660aa8a6?q=80&w=800&auto=format&fit=crop"],
    stock: 50,
    sku: "ACC-MX3S",
  },
  {
    slug: "airpods-pro-2",
    name: "Apple AirPods Pro (2nd Gen)",
    brand: "Apple",
    categorySlug: "accessories",
    price: 249,
    description: "Magic, remastered. Now with USB-C and 2x more Active Noise Cancellation.",
    images: ["https://images.unsplash.com/photo-1588423770574-91021160dfbb?q=80&w=800&auto=format&fit=crop"],
    stock: 35,
    sku: "ACC-APP2",
  },
  {
    slug: "samsung-t7-ssd",
    name: "Samsung T7 1TB SSD",
    brand: "Samsung",
    categorySlug: "accessories",
    price: 129,
    description: "Lightning fast portable storage in a sleek, pocket-sized design.",
    images: ["https://images.unsplash.com/photo-1623126908029-58cb08a2b272?q=80&w=800&auto=format&fit=crop"],
    stock: 60,
    sku: "ACC-T7",
  },
  {
    slug: "keychron-q1",
    name: "Keychron Q1 Keyboard",
    brand: "Keychron",
    categorySlug: "accessories",
    price: 169,
    description: "Premium mechanical keyboard with full CNC aluminum body and hot-swappable switches.",
    images: ["https://images.unsplash.com/photo-1618384881928-bbcd1874229b?q=80&w=800&auto=format&fit=crop"],
    stock: 20,
    sku: "ACC-KQ1",
  },

  // --- TABLETS ---
  {
    slug: "ipad-pro-m4",
    name: "iPad Pro 13\" (M4)",
    brand: "Apple",
    categorySlug: "tablets",
    price: 1299,
    description: "The most powerful iPad ever. Pro Motion, OLED, and M4 speed.",
    images: ["/images/products/ipad-pro.png"],
    stock: 15,
    sku: "TAB-IPProM4",
  },
  {
    slug: "samsung-tab-s9-ultra",
    name: "Samsung Galaxy Tab S9 Ultra",
    brand: "Samsung",
    categorySlug: "tablets",
    price: 1099,
    description: "Stunning 14.6\" Dynamic AMOLED 2X display with S Pen included.",
    images: ["https://images.unsplash.com/photo-1601524345197-6a721a399830?q=80&w=800&auto=format&fit=crop"],
    stock: 12,
    sku: "TAB-S9U",
  },
  {
    slug: "surface-pro-9",
    name: "Microsoft Surface Pro 9",
    brand: "Microsoft",
    categorySlug: "tablets",
    price: 999,
    description: "The power of a laptop with the flexibility of a tablet.",
    images: ["https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?q=80&w=800&auto=format&fit=crop"],
    stock: 10,
    sku: "TAB-SPRO9",
  },
  {
    slug: "ipad-mini-6",
    name: "iPad mini (6th Gen)",
    brand: "Apple",
    categorySlug: "tablets",
    price: 499,
    description: "Mega power, mini size. The complete iPad experience in your palm.",
    images: ["https://images.unsplash.com/photo-1557813583-05f77839634e?q=80&w=800&auto=format&fit=crop"],
    stock: 25,
    sku: "TAB-IPMINI",
  },
  {
    slug: "remarkable-2",
    name: "reMarkable 2",
    brand: "reMarkable",
    categorySlug: "tablets",
    price: 399,
    description: "The paper tablet. Replace your notebooks and printouts with a tablet that feels like paper.",
    images: ["https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=800&auto=format&fit=crop"],
    stock: 18,
    sku: "TAB-RM2",
  },

  // --- WEARABLES ---
  {
    slug: "apple-watch-ultra-2",
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    categorySlug: "wearables",
    price: 799,
    description: "The most rugged and capable Apple Watch. Built for outdoor adventures.",
    images: ["/images/products/apple-watch-ultra.png"],
    stock: 20,
    sku: "WR-AWU2",
  },
  {
    slug: "garmin-fenix-7",
    name: "Garmin Fenix 7 Sapphire Solar",
    brand: "Garmin",
    categorySlug: "wearables",
    price: 899,
    description: "Multisport GPS watch with solar charging and long battery life.",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"],
    stock: 15,
    sku: "WR-FENIX7",
  },
  {
    slug: "pixel-watch-2",
    name: "Google Pixel Watch 2",
    brand: "Google",
    categorySlug: "wearables",
    price: 349,
    description: "The best of Google and Fitbit. Personalized health and safety features.",
    images: ["https://images.unsplash.com/photo-1508685096489-7aac291ba59e?q=80&w=800&auto=format&fit=crop"],
    stock: 22,
    sku: "WR-PIXELW2",
  },
  {
    slug: "samsung-galaxy-watch-6",
    name: "Samsung Galaxy Watch 6 Classic",
    brand: "Samsung",
    categorySlug: "wearables",
    price: 399,
    description: "Classic design with a rotating bezel and advanced sleep coaching.",
    images: ["https://images.unsplash.com/photo-1617625818243-1bc13e019313?q=80&w=800&auto=format&fit=crop"],
    stock: 30,
    sku: "WR-GW6C",
  },
  {
    slug: "huawei-watch-gt-4",
    name: "Huawei Watch GT 4",
    brand: "Huawei",
    categorySlug: "wearables",
    price: 249,
    description: "Fashion Forward design with up to 14 days of battery life.",
    images: ["https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=800&auto=format&fit=crop"],
    stock: 25,
    sku: "WR-GT4",
  },
];

async function ensureCategories() {
  for (const c of ELECTRONICS_CATEGORIES) {
    await Category.findOneAndUpdate(
      { slug: c.slug },
      { name: c.name, description: c.description, sortOrder: c.sortOrder },
      { upsert: true, new: true }
    );
  }
}

async function seed() {
  await connectDB();
  await ensureCategories();

  const categories = await Category.find();
  const catBySlug = {};
  categories.forEach(c => { catBySlug[c.slug] = c._id; });

  for (const p of SAMPLE_PRODUCTS) {
    const categoryId = catBySlug[p.categorySlug];
    if (!categoryId) {
       console.warn(`Category not found for: ${p.categorySlug}`);
       continue;
    }
    await Product.findOneAndUpdate(
      { slug: p.slug },
      {
        name: p.name,
        brand: p.brand,
        description: p.description,
        price: p.price,
        ...(p.compareAtPrice != null && { compareAtPrice: p.compareAtPrice }),
        images: p.images,
        category: categoryId,
        stock: p.stock,
        sku: p.sku,
        isActive: true,
      },
      { upsert: true, new: true, runValidators: true }
    );
    console.log(`Product ready: ${p.slug}`);
  }

  console.log(`Sample products seeded: ${SAMPLE_PRODUCTS.length} items (5 per category).`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
