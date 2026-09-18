/**
 * CINEMATIC MEDIA GENERATOR v2 — Visual Experience Override (18 Sep 2026 addendum)
 * ----------------------------------------------------------------------------
 * Generates every image the media-first Maosaji site needs:
 *   - hero film frames (landscape + portrait derivatives)
 *   - brand-statement studio cutouts on ivory
 *   - EAT / SWEET / BAKERY / CELEBRATE / STORY / FINAL chapter imagery
 *   - all previously-missing category/item/gallery images (fixes 404s)
 *
 * All imagery is GENERATED CONCEPT ASSET (see MEDIA_PLAN.md provenance).
 * Idempotent: skips files that already exist. Resume by re-running.
 * Run: bun .zscripts/generate-v2.ts
 */
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT = '/home/z/my-project/public/images';
const SPACING_MS = 14_000;   // pacing between successful generations
const RETRY_WAIT_MS = 45_000; // backoff on rate-limit / failure

/* Art-direction constants */
const FILM =
  'cinematic food film still, moody low-key lighting, deep warm shadows, rich contrast, glistening texture, faint steam, editorial food photography, dark charcoal background, photorealistic, high detail, no text, no watermark, no logos, no faces';
const STUDIO =
  'premium editorial food photography centered on a seamless warm ivory cream studio background, soft directional window light, one gentle soft shadow, minimal styling, photorealistic, high detail, no text, no watermark, no logos';
const WARM =
  'warm editorial food photography, soft natural window light, muted warm tones, restrained saturation, rustic ceramic and brass tableware, shallow depth of field, photorealistic, professional, high detail, no text, no watermark, no logos';
const VEG = 'pure vegetarian Indian food, no meat, no eggs';
const BAKERY_STYLE =
  'clean editorial bakery photography, cream and white palette, directional natural light, generous negative space, minimal props, photorealistic, high detail, no text, no watermark, no logos';

type Job = { file: string; prompt: string; size: string };

const jobs: Job[] = [
  /* ── HERO FILM · 6-shot conceptual sequence (landscape) ── */
  { file: 'film/film-1-thali.jpg', size: '1344x768', prompt: `Overhead close view of a grand Indian vegetarian thali on dark slate: small bowls of dal, paneer curry, seasonal vegetables, rice, a hand gently placing fresh roti onto the plate, rising steam, scattered marigold petals, ${VEG}, ${FILM}` },
  { file: 'film/film-2-dosa.jpg', size: '1344x768', prompt: `Golden masala dosa crisping on a black cast-iron griddle, ladle spreading batter in a wide circle, lacy golden-brown edges, wisps of steam, spatula lifting one crisp edge, ${VEG}, ${FILM}` },
  { file: 'film/film-3-mithai.jpg', size: '1344x768', prompt: `Extreme macro of assorted Indian mithai on a brass tray: kaju katli with edible silver leaf, saffron threads, pistachio slivers, glistening sugar syrup sheen, ${VEG}, ${FILM}` },
  { file: 'film/film-4-garnish.jpg', size: '1344x768', prompt: `Macro of pistachio slivers and rose petals falling softly onto a cube of barfi topped with silver leaf, frozen mid-air, warm rim light, ${VEG}, ${FILM}` },
  { file: 'film/film-5-bakery.jpg', size: '1344x768', prompt: `Close detail of a pastry knife slicing through a soft cream cake, layers of sponge and cream visible, crumb texture, a pastry and cookie blurred behind, ${FILM}` },
  { file: 'film/film-6-box.jpg', size: '1344x768', prompt: `Hands closing a premium gift box filled with Indian sweets and namkeen, tying a deep red ribbon bow, warm focused lamp light, box texture detail, no faces, ${FILM}` },

  /* ── HERO FILM · portrait derivatives for mobile ── */
  { file: 'film/film-1-thali-p.jpg', size: '768x1344', prompt: `Vertical overhead close view of a grand Indian vegetarian thali on dark slate: bowls of dal, paneer curry, rice, roti, rising steam, marigold petals, tight portrait crop, ${VEG}, ${FILM}` },
  { file: 'film/film-2-dosa-p.jpg', size: '768x1344', prompt: `Vertical view of a golden masala dosa on black cast-iron griddle, lacy crisp edges, steam rising, portrait crop focused on texture, ${VEG}, ${FILM}` },
  { file: 'film/film-3-mithai-p.jpg', size: '768x1344', prompt: `Vertical extreme macro of Indian mithai stack with silver leaf, saffron, pistachio, syrup sheen on brass tray, portrait crop, ${VEG}, ${FILM}` },

  /* ── EAT chapter ── */
  { file: 'eat/eat-wide.jpg', size: '1344x768', prompt: `Wide cinematic table scene of an Indian vegetarian feast being enjoyed: brass thali with curries and roti, chutney bowls, chai glasses, hands reaching for food, warm tungsten glow, lively but moody, ${VEG}, ${FILM}` },
  { file: 'eat/sticky-dosa.jpg', size: '864x1152', prompt: `Masala dosa folded on a banana leaf with coconut chutney and sambar in steel bowls, vertical composition, ${VEG}, ${WARM}` },
  { file: 'eat/sticky-curry.jpg', size: '864x1152', prompt: `Creamy paneer butter masala in a copper handi garnished with cream swirl and coriander, vertical composition, ${VEG}, ${WARM}` },
  { file: 'eat/sticky-thali.jpg', size: '864x1152', prompt: `Grand vegetarian thali on brass plate with dal, sabzi, rice, roti, papad, salad and a small sweet, vertical composition, ${VEG}, ${WARM}` },
  { file: 'eat/sticky-chaat.jpg', size: '864x1152', prompt: `Raj kachori chaat with yogurt, tamarind chutney, sev and pomegranate in an earthen bowl, vertical composition, ${VEG}, ${WARM}` },

  /* ── SWEET chapter ── */
  { file: 'sweet/sweet-wide.jpg', size: '1344x768', prompt: `Panoramic macro of Indian sweets arranged in gleaming rows on brass trays: kaju katli with silver leaf, orange motichoor laddoo, ivory barfi, gulab jamun in syrup, saffron and pistachio detail, ${VEG}, ${FILM}` },
  { file: 'sweet/sweet-tall.jpg', size: '768x1344', prompt: `Vertical macro tower of Indian mithai: stacked barfi and laddoo with silver leaf and crushed pistachio, syrup drizzle catching light, ${VEG}, ${FILM}` },
  { file: 'sweet/rail-katli.jpg', size: '1024x1024', prompt: `Diamond kaju katli pieces with edible silver leaf arranged in a fanned row on dark slate, macro, ${VEG}, ${FILM}` },
  { file: 'sweet/rail-laddoo.jpg', size: '1024x1024', prompt: `Orange motichoor laddoo with fine boondi texture and pistachio garnish on dark slate, macro, ${VEG}, ${FILM}` },
  { file: 'sweet/rail-barfi.jpg', size: '1024x1024', prompt: `Layered pistachio and kesar barfi squares with silver leaf on dark slate, macro, ${VEG}, ${FILM}` },
  { file: 'sweet/rail-jamun.jpg', size: '1024x1024', prompt: `Glossy gulab jamun in saffron sugar syrup with crushed pistachio, dark bowl, macro, ${VEG}, ${FILM}` },

  /* ── BAKERY chapter ── */
  { file: 'bakery/bakery-wide.jpg', size: '1344x768', prompt: `Wide clean bakery scene: whole cream cake on marble stand, pastries and cookies arranged with generous space, soft morning light, cream and ivory palette, ${BAKERY_STYLE}` },
  { file: 'bakery/bakery-tall.jpg', size: '768x1344', prompt: `Vertical bakery still life: layered pastry, madeleine and cookie stack on marble with linen, soft directional light, generous whitespace, ${BAKERY_STYLE}` },

  /* ── CELEBRATE chapter ── */
  { file: 'celebrate/celebrate-wide.jpg', size: '1344x768', prompt: `Wide scene of premium Indian gift boxes being packed: rows of sweets and namkeen boxes with deep red ribbons on a linen-covered table, hands arranging, warm festive but restrained light, no faces, ${FILM}` },
  { file: 'celebrate/celebrate-tall.jpg', size: '768x1344', prompt: `Vertical celebration table detail: brass diya candle, marigold garland, sweets box with ribbon, folded napkin, warm bokeh, no faces, ${FILM}` },

  /* ── STORY + FINAL ── */
  { file: 'hero-story.jpg', size: '1344x768', prompt: `Warm interior of an upscale Indian vegetarian restaurant: wooden chairs, marble tables, brass pendant lamps glowing, cream walls with subtle arch motifs, empty tables set for service, evening light through windows, editorial architectural photography, no people, no readable text, no logos` },
  { file: 'final/final-wide.jpg', size: '1344x768', prompt: `Slow-motion style still of masala chai being poured from height into a brass glass, froth and splash, steam curling, dark background with warm lamp glow, ${FILM}` },

  /* ── Brand statement studio cutouts (for masks on ivory field) ── */
  { file: 'brand/thali-arch.jpg', size: '1024x1024', prompt: `Overhead view of an Indian vegetarian thali centered on seamless warm ivory background, brass plate with dal, sabzi, rice, roti, small sweet bowl, soft shadow beneath, ${VEG}, ${STUDIO}` },
  { file: 'brand/dosa-roll.jpg', size: '1024x1024', prompt: `Golden rolled dosa standing upright centered on seamless warm ivory background with two chutney bowls, soft shadow, ${VEG}, ${STUDIO}` },
  { file: 'brand/laddoo-stack.jpg', size: '1024x1024', prompt: `Small stack of three orange motichoor laddoo with pistachio centered on seamless warm ivory background, soft shadow, ${VEG}, ${STUDIO}` },
  { file: 'brand/cake-slice.jpg', size: '1024x1024', prompt: `One elegant cream cake slice with berry centered on seamless warm ivory background, soft shadow, ${STUDIO}` },
  { file: 'brand/chaat-bowl.jpg', size: '1024x1024', prompt: `Small earthen bowl of papdi chaat with yogurt, sev and pomegranate centered on seamless warm ivory background, soft shadow, ${VEG}, ${STUDIO}` },

  /* ── Missing category images (fix 404s) ── */
  { file: 'cat-restaurant.jpg', size: '1024x1024', prompt: `North Indian vegetarian curry with fresh roti in brass bowls on cream linen, ${VEG}, ${WARM}` },
  { file: 'cat-chaat.jpg', size: '1024x1024', prompt: `Indian chaat papdi with yogurt, tamarind chutney, sev and pomegranate in earthen bowl, ${VEG}, ${WARM}` },
  { file: 'cat-beverages.jpg', size: '1024x1024', prompt: `Masala chai in brass glass and fresh lime soda with mint on wooden tray, ${WARM}` },

  /* ── Missing item images (fix 404s) ── */
  { file: 'items/maosaji-thali.jpg', size: '1024x1024', prompt: `Grand Indian vegetarian thali on brass plate: dal, paneer curry, seasonal sabzi, rice, roti, papad, salad, sweet in small bowl, ${VEG}, ${WARM}` },
  { file: 'items/plain-dosa.jpg', size: '1024x1024', prompt: `Simple golden plain dosa rolled on a steel plate with coconut chutney and sambar, ${VEG}, ${WARM}` },
  { file: 'items/idli-sambar.jpg', size: '1024x1024', prompt: `Soft steamed idlis in a steel bowl of hot sambar with coconut chutney, ${VEG}, ${WARM}` },
  { file: 'items/paneer-butter-masala.jpg', size: '1024x1024', prompt: `Creamy paneer butter masala in a copper handi garnished with cream swirl and coriander, butter naan beside, ${VEG}, ${WARM}` },
  { file: 'items/dal-tadka.jpg', size: '1024x1024', prompt: `Golden dal tadka with tempered spices and ghee in a brass bowl, jeera rice beside, ${VEG}, ${WARM}` },
  { file: 'items/veg-manchurian.jpg', size: '1024x1024', prompt: `Vegetable manchurian balls glazed in glossy sauce with spring onions in a ceramic bowl, Indo-Chinese style, ${VEG}, ${WARM}` },
  { file: 'items/hakka-noodles.jpg', size: '1024x1024', prompt: `Vegetable hakka noodles tossed with julienned vegetables in a steel wok with chopsticks, ${VEG}, ${WARM}` },
  { file: 'items/chole-bhature.jpg', size: '1024x1024', prompt: `Fluffy golden bhature with chole curry, onion salad and pickle on a steel plate, ${VEG}, ${WARM}` },
  { file: 'items/pav-bhaji.jpg', size: '1024x1024', prompt: `Buttery red pav bhaji in a steel plate with toasted buttered pav, chopped onions and lemon, ${VEG}, ${WARM}` },
  { file: 'items/kachori-chaat.jpg', size: '1024x1024', prompt: `Raj kachori chaat with yogurt, chutneys, sev and pomegranate seeds in an earthen bowl, ${VEG}, ${WARM}` },
  { file: 'items/samosa.jpg', size: '1024x1024', prompt: `Crispy golden samosas with tamarind and mint chutney on a brass plate, ${VEG}, ${WARM}` },
  { file: 'items/veg-spring-rolls.jpg', size: '1024x1024', prompt: `Crispy vegetable spring rolls cut open showing the filling, with sweet chilli dip, ${VEG}, ${WARM}` },
  { file: 'items/masala-chai.jpg', size: '1024x1024', prompt: `Masala chai in a brass glass with steam, cardamom and cinnamon beside, ${WARM}` },
  { file: 'items/cold-coffee.jpg', size: '1024x1024', prompt: `Tall glass of creamy cold coffee with foam and chocolate dust, ${WARM}` },
  { file: 'items/fresh-lime-soda.jpg', size: '1024x1024', prompt: `Sparkling fresh lime soda with mint leaves and lime wheel in a tall glass, condensation, ${WARM}` },
  { file: 'items/aloo-bhujia.jpg', size: '1024x1024', prompt: `Crisp golden aloo bhujia namkeen piled in a brass bowl with a spoon, ${VEG}, ${WARM}` },
  { file: 'items/navratan-mixture.jpg', size: '1024x1024', prompt: `Navratan mixture namkeen with nuts, sev and fried curry leaves in a brass bowl, ${VEG}, ${WARM}` },

  /* ── Gallery additions ── */
  { file: 'gallery/celebration-table.jpg', size: '1024x1024', prompt: `Elegant Indian celebration table detail with brass thalis, marigold, sweets boxes and candles, warm evening light, ${VEG}, ${WARM}` },
  { file: 'gallery/dining.jpg', size: '1024x1024', prompt: `Cozy corner of an Indian restaurant with wooden table set for two, brass water glasses, soft window light, ${WARM}` },
  { file: 'gallery/food-detail.jpg', size: '1024x1024', prompt: `Macro detail of ghee being drizzled over hot dal with tadka spices sizzling, ${VEG}, ${WARM}` },
  { file: 'gallery/kitchen.jpg', size: '1024x1024', prompt: `Indian restaurant kitchen pass with steel counters, hanging pots and warm light, chef hands plating in soft focus, no faces, ${WARM}` },
  { file: 'gallery/sweets-counter.jpg', size: '1024x1024', prompt: `Traditional Indian sweets shop counter with glass case full of mithai trays arranged in neat colorful rows, warm display lighting, no readable text, ${VEG}, ${WARM}` },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

process.on('unhandledRejection', (r) => console.log('[imggen-v2] suppressed rejection:', String(r).slice(0, 120)));
process.on('uncaughtException', (e) => console.log('[imggen-v2] suppressed exception:', String(e?.message ?? e).slice(0, 120)));

async function run() {
  for (const d of ['film', 'eat', 'sweet', 'bakery', 'celebrate', 'final', 'brand', 'items', 'gallery']) {
    fs.mkdirSync(path.join(OUT, d), { recursive: true });
  }
  const zai = await ZAI.create();
  const pending = jobs.filter((j) => !fs.existsSync(path.join(OUT, j.file)));
  const total = jobs.length;
  console.log(`[imggen-v2] total=${total} already=${total - pending.length} pending=${pending.length} ${new Date().toISOString()}`);
  if (pending.length === 0) {
    console.log('[imggen-v2] V2_COMPLETE');
    return;
  }
  let done = 0;
  let gaveUp = 0;

  for (const job of pending) {
    const outPath = path.join(OUT, job.file);
    let ok = false;
    for (let attempt = 1; attempt <= 4 && !ok; attempt++) {
      try {
        const res = await zai.images.generations.create({ prompt: job.prompt, size: job.size });
        const b64 = res?.data?.[0]?.base64;
        if (!b64) throw new Error('empty base64');
        const buf = Buffer.from(b64, 'base64');
        if (buf.length < 20_000) throw new Error(`suspiciously small (${buf.length}b)`);
        fs.writeFileSync(outPath, buf);
        ok = true;
        done++;
        console.log(`[imggen-v2] OK ${done}/${pending.length} ${job.file} ${(buf.length / 1024).toFixed(0)}kb ${new Date().toISOString()}`);
      } catch (e: unknown) {
        const msg = String((e as { message?: string })?.message ?? e).slice(0, 100);
        console.log(`[imggen-v2] retry ${job.file} attempt ${attempt}: ${msg}`);
        await sleep(RETRY_WAIT_MS);
      }
    }
    if (!ok) {
      gaveUp++;
      console.log(`[imggen-v2] GAVE_UP ${job.file}`);
    }
    await sleep(SPACING_MS);
  }
  console.log(`[imggen-v2] run finished: ok=${done} gaveUp=${gaveUp} remaining=${jobs.filter((j) => !fs.existsSync(path.join(OUT, j.file))).length}`);
  if (gaveUp === 0 && jobs.every((j) => fs.existsSync(path.join(OUT, j.file)))) {
    console.log('[imggen-v2] V2_COMPLETE');
  }
}

run().catch((e) => { console.error('[imggen-v2] FATAL', e); process.exit(1); });
