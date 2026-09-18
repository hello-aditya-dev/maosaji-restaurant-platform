/**
 * BATCH ITEM IMAGE GENERATOR
 * Generates a 1024×1024 food photograph for every menu item whose
 * imageUrl is currently null, then converts the PNG to a small JPEG via
 * sharp (quality 85, ~50–150 KB — matches the existing item-image budget).
 *
 * Run:  bun run scripts/generate-item-images.ts
 * Idempotent: skips items whose .jpg already exists on disk.
 *
 * Art direction (from MEDIA_PLAN.md):
 *  - Restaurant dishes: warm, natural light, rich, on ceramic/steel
 *  - Sweets: macro, deep warm tones, garnish, silver leaf
 *  - Bakery: lighter, clean surfaces, soft daylight, product-focused
 *  - Beverages: tall glass, condensation, warm backdrop
 * Never include text, watermark, or logos.
 */
import ZAI from "z-ai-web-dev-sdk";
import fs from "fs";
import path from "path";
import sharp from "sharp";

const OUT_DIR = path.join(process.cwd(), "public/images/items");

type Item = { slug: string; prompt: string };

// Per-item prompts — each describes the actual dish + the art direction.
const ITEMS: Item[] = [
  // ── THALIS ──
  { slug: "mini-thali", prompt: "Indian vegetarian mini thali on a brass platter, small bowls of dal sabzi rice roti curd pickle, overhead shot, warm natural window light, dark wood table, premium restaurant food photography, no text, no watermark" },
  { slug: "deluxe-thali", prompt: "Deluxe Indian vegetarian thali on a copper thali plate, many small bowls of paneer dal sabzi rice curd papad pickle sweet, banana leaf garnish, overhead, warm light, premium food photography, no text, no watermark" },
  { slug: "supreme-thali", prompt: "Supreme Indian vegetarian thali, large brass thali with many bowls of paneer sabzi dal rice curd papad pickle sweet farsaan, garnished, overhead, warm festive light, premium food photography, no text, no watermark" },
  // ── SOUTH INDIAN ──
  { slug: "cheese-masala-dosa", prompt: "Cheese masala dosa on a steel plate, golden crispy rolled dosa with melted cheese oozing, coconut chutney sambar in small bowls, garnish, overhead, warm light, South Indian restaurant food photography, no text, no watermark" },
  { slug: "jini-dosa", prompt: "Jini dosa, finely chopped masala-loaded crispy dosa rolled, grated cheese and veggies, chutneys on side, steel plate, overhead, warm light, premium South Indian food photography, no text, no watermark" },
  { slug: "mysore-masala-dosa", prompt: "Mysore masala dosa, golden crispy dosa with red spicy chutney inside, potato filling, sambar and coconut chutney in bowls, steel plate, overhead, warm light, premium South Indian food photography, no text, no watermark" },
  { slug: "mix-veg-uttapam", prompt: "Mix veg uttapam, thick pancake dosa topped with diced carrots onions capsicum tomatoes, on a steel plate with chutney, overhead, warm light, South Indian food photography, no text, no watermark" },
  { slug: "onion-uttapam", prompt: "Onion uttapam, thick pancake dosa topped with finely chopped onions and coriander, steel plate, coconut chutney on the side, overhead, warm light, South Indian food photography, no text, no watermark" },
  { slug: "masala-idli", prompt: "Masala idli, steamed rice idlis cut and tossed with spices curry leaves mustard seeds onions, on a steel plate, overhead, warm light, South Indian food photography, no text, no watermark" },
  { slug: "medu-vada", prompt: "Medu vada, golden crisp lentil doughnut shaped vadas, sambar and coconut chutney in small steel bowls, garnish, overhead, warm light, South Indian food photography, no text, no watermark" },
  // ── NORTH INDIAN ──
  { slug: "paneer-lababdar", prompt: "Paneer lababdar in a copper bowl, creamy orange gravy with paneer cubes, garnish of cream and coriander, naan on the side, warm light, premium North Indian food photography, no text, no watermark" },
  { slug: "dal-makhni", prompt: "Dal makhni in a black bowl, dark creamy lentil curry, swirl of cream on top, garnish of coriander and butter, warm light, premium North Indian food photography, no text, no watermark" },
  { slug: "shahi-paneer", prompt: "Shahi paneer in a ceramic bowl, rich creamy orange gravy with paneer cubes, garnish of cashews and coriander, warm light, premium North Indian food photography, no text, no watermark" },
  { slug: "veg-kofta", prompt: "Veg kofta curry in a copper bowl, round vegetable dumplings in a rich gravy, garnish of cream and coriander, warm light, premium North Indian food photography, no text, no watermark" },
  { slug: "mattar-paneer", prompt: "Mattar paneer in a ceramic bowl, orange gravy with paneer cubes and green peas, garnish of coriander, warm light, premium North Indian food photography, no text, no watermark" },
  { slug: "aloo-gobi", prompt: "Aloo gobi in a steel bowl, dry potato and cauliflower curry with turmeric and spices, garnish of coriander, warm light, premium North Indian food photography, no text, no watermark" },
  { slug: "chole", prompt: "Chole in a steel bowl, dark chickpea curry with whole spices, onion rings and lemon on the side, warm light, premium North Indian food photography, no text, no watermark" },
  // ── CHINESE ──
  { slug: "schezwan-noodles", prompt: "Schezwan veg noodles in a black bowl, spicy red noodles with julienned vegetables and chilli, chopsticks, warm light, premium Indo-Chinese food photography, no text, no watermark" },
  { slug: "chilli-paneer", prompt: "Chilli paneer in a black bowl, paneer cubes with peppers and onions in a glossy spicy sauce, garnish of spring onion, warm light, premium Indo-Chinese food photography, no text, no watermark" },
  { slug: "veg-fried-rice", prompt: "Veg fried rice in a black bowl, wok-tossed rice with julienned vegetables and soy, chopsticks, warm light, premium Indo-Chinese food photography, no text, no watermark" },
  { slug: "paneer-fried-rice", prompt: "Paneer fried rice in a black bowl, wok-tossed rice with paneer cubes and vegetables, chopsticks, warm light, premium Indo-Chinese food photography, no text, no watermark" },
  // ── CHAAT & SNACKS ──
  { slug: "cheese-pav-bhaji", prompt: "Cheese pav bhaji on a steel plate, buttery orange vegetable mash topped with grated melted cheese, toasted pav buns on the side, onion and lemon, warm light, premium Indian street food photography, no text, no watermark" },
  { slug: "dahi-samosa", prompt: "Dahi samosa chaat on a ceramic plate, crushed samosa topped with curd green chutney tamarind chutney sev pomegranate, warm light, premium Indian street food photography, no text, no watermark" },
  { slug: "aloo-tikki", prompt: "Aloo tikki chaat on a ceramic plate, golden potato tikkis topped with curd chutneys sev pomegranate and coriander, warm light, premium Indian street food photography, no text, no watermark" },
  { slug: "dahi-puri", prompt: "Dahi puri chaat on a ceramic plate, crisp puri shells filled with curd chutneys sev pomegranate and coriander, warm light, premium Indian street food photography, no text, no watermark" },
  { slug: "sev-puri", prompt: "Sev puri chaat on a ceramic plate, crisp puri shells topped with chutneys onions tomatoes and fine sev, warm light, premium Indian street food photography, no text, no watermark" },
  // ── SWEETS (macro, deep warm tones) ──
  { slug: "milk-cake", prompt: "Indian milk cake sweet, granular caramelised milk fudge cut into squares on a brass plate, garnished with cardamom, macro close-up, deep warm tones, premium mithai photography, no text, no watermark" },
  { slug: "kesariya-jalebi", prompt: "Kesariya jalebi, saffron orange crispy syrup-soaked jalebis on a brass plate, garnish of saffron strands, macro close-up, deep warm tones, premium mithai photography, no text, no watermark" },
  { slug: "ghee-boondi-laddu", prompt: "Ghee boondi laddu, golden round boondi laddoos on a brass plate, garnish of chopped nuts, macro close-up, deep warm tones, premium mithai photography, no text, no watermark" },
  { slug: "besan-laddoo", prompt: "Besan laddoo, golden brown gram flour laddoos on a brass plate, garnish of chopped cashews, macro close-up, deep warm tones, premium mithai photography, no text, no watermark" },
  { slug: "petha", prompt: "Indian petha sweet, soft translucent white ash gourd cubes on a brass plate, macro close-up, soft warm light, premium mithai photography, no text, no watermark" },
  { slug: "sohan-halwa", prompt: "Sohan halwa, rich ghee halwa with chopped almonds pistachios and cashews, on a brass plate, macro close-up, deep warm tones, premium mithai photography, no text, no watermark" },
  // ── BAKERY & CAKES (light, clean) ──
  { slug: "chocolate-pastry", prompt: "Chocolate pastry on a white ceramic plate, chocolate sponge with fudge layers, a fork beside it, clean white marble surface, soft daylight, premium bakery photography, no text, no watermark" },
  { slug: "butterscotch-pastry", prompt: "Butterscotch pastry on a white ceramic plate, butterscotch cream layers with praline bits, a fork beside it, clean white marble surface, soft daylight, premium bakery photography, no text, no watermark" },
  { slug: "vanilla-pastry", prompt: "Vanilla pastry on a white ceramic plate, vanilla sponge with cream layers, a fork beside it, clean white marble surface, soft daylight, premium bakery photography, no text, no watermark" },
  { slug: "black-forest-cake", prompt: "Black Forest cake, whole round chocolate sponge cake with cream cherries and chocolate shavings, on a cake stand, clean light background, soft daylight, premium bakery photography, no text, no watermark" },
  { slug: "chocolate-cake", prompt: "Chocolate cake, whole round moist chocolate sponge with glossy chocolate ganache, on a cake stand, clean light background, soft daylight, premium bakery photography, no text, no watermark" },
  { slug: "butterscotch-cake", prompt: "Butterscotch cake, whole round cake with butterscotch cream and praline on top, on a cake stand, clean light background, soft daylight, premium bakery photography, no text, no watermark" },
  { slug: "pineapple-cake", prompt: "Pineapple cake, whole round vanilla sponge cake with cream and pineapple chunks on top, on a cake stand, clean light background, soft daylight, premium bakery photography, no text, no watermark" },
  { slug: "butter-cookies", prompt: "Butter cookies, golden round melt-in-mouth cookies on a white ceramic plate, a few stacked, clean light surface, soft daylight, premium bakery photography, no text, no watermark" },
  { slug: "khari", prompt: "Khari biscuits, flaky golden savoury puff biscuits on a white ceramic plate, a few stacked, clean light surface, soft daylight, premium bakery photography, no text, no watermark" },
  { slug: "rusk", prompt: "Indian rusk bread, golden twice-baked crisp slices stacked on a white ceramic plate, clean light surface, soft daylight, premium bakery photography, no text, no watermark" },
  // ── NAMKEEN ──
  { slug: "moong-dal-namkeen", prompt: "Moong dal namkeen, golden fried salted moong dal in a brass bowl, crunchy, macro close-up, warm light, premium Indian snack photography, no text, no watermark" },
  { slug: "masala-peanuts", prompt: "Masala peanuts, spiced fried peanuts coated in gram flour, in a brass bowl, macro close-up, warm light, premium Indian snack photography, no text, no watermark" },
  { slug: "sev-bhujia", prompt: "Fine sev bhujia, thin yellow spiced gram flour sev piled in a brass bowl, macro close-up, warm light, premium Indian snack photography, no text, no watermark" },
  { slug: "roasted-cashews", prompt: "Roasted salted cashew nuts in a brass bowl, golden and glossy, macro close-up, warm light, premium dry fruit photography, no text, no watermark" },
  { slug: "roasted-almonds", prompt: "Roasted salted almonds in a brass bowl, golden brown, macro close-up, warm light, premium dry fruit photography, no text, no watermark" },
  // ── BEVERAGES ──
  { slug: "filter-coffee", prompt: "South Indian filter coffee in a steel tumbler and dabara, frothy hot coffee, warm light, condensation on a dark wood table, premium beverage photography, no text, no watermark" },
  { slug: "chocolate-shake", prompt: "Chocolate milkshake in a tall glass, thick and creamy, topped with whipped cream and chocolate drizzle, a straw, warm light, premium beverage photography, no text, no watermark" },
  { slug: "strawberry-shake", prompt: "Strawberry milkshake in a tall glass, pink and thick, topped with whipped cream and a strawberry, a straw, warm light, premium beverage photography, no text, no watermark" },
  { slug: "vanilla-shake", prompt: "Vanilla milkshake in a tall glass, thick and creamy, topped with whipped cream and a vanilla wafer, a straw, warm light, premium beverage photography, no text, no watermark" },
  { slug: "mango-shake", prompt: "Mango milkshake in a tall glass, thick yellow mango, topped with cream and a mint leaf, a straw, warm light, premium beverage photography, no text, no watermark" },
  { slug: "sweet-lassi", prompt: "Sweet lassi in a tall steel glass, thick pale yellow yogurt drink, topped with cream and a pinch of cardamom, warm light, premium beverage photography, no text, no watermark" },
  { slug: "salted-lassi", prompt: "Salted lassi in a tall steel glass, frothy pale yogurt drink, topped with a pinch of cumin and mint, warm light, premium beverage photography, no text, no watermark" },
  { slug: "rose-milk", prompt: "Chilled rose milk in a tall glass, pink rose-flavoured milk, topped with rose petals, a straw, warm light, premium beverage photography, no text, no watermark" },
];

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  const zai = await ZAI.create();

  let ok = 0;
  let skipped = 0;
  let failed = 0;
  const failures: string[] = [];

  for (const item of ITEMS) {
    const outPath = path.join(OUT_DIR, `${item.slug}.jpg`);
    if (fs.existsSync(outPath)) {
      skipped++;
      console.log(`SKIP ${item.slug} (exists)`);
      continue;
    }

    try {
      console.log(`GEN  ${item.slug} ...`);
      const t0 = Date.now();
      const resp = await zai.images.generations.create({
        prompt: item.prompt,
        size: "1024x1024",
      });
      const b64 = resp.data?.[0]?.base64;
      if (!b64) throw new Error("no base64 in response");
      const pngBuf = Buffer.from(b64, "base64");
      // Convert PNG → JPEG at quality 85, keep file size in budget (~50-150KB).
      const jpgBuf = await sharp(pngBuf).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
      // Atomic write: temp file + rename so a SIGTERM mid-write never leaves a
      // truncated .jpg that next/image would fail to decode.
      const tmpPath = outPath + ".tmp";
      fs.writeFileSync(tmpPath, jpgBuf);
      fs.renameSync(tmpPath, outPath);
      const kb = Math.round(jpgBuf.length / 1024);
      ok++;
      console.log(` OK  ${item.slug} (${kb}KB, ${Date.now() - t0}ms)`);
    } catch (e) {
      failed++;
      const msg = (e as Error).message;
      failures.push(`${item.slug}: ${msg}`);
      console.error(`FAIL ${item.slug}: ${msg}`);
      // brief backoff before retrying the next
      await new Promise((r) => setTimeout(r, 1500));
    }
  }

  console.log("\n=== SUMMARY ===");
  console.log(`generated: ${ok} | skipped: ${skipped} | failed: ${failed} | total: ${ITEMS.length}`);
  if (failures.length) {
    console.log("Failures:");
    for (const f of failures) console.log(`  - ${f}`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
