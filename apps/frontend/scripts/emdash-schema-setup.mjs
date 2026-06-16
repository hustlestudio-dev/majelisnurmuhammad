#!/usr/bin/env node
/**
 * One-off (idempotent) EmDash schema setup for this site.
 *
 * Creates the `hero` and `info_situs` collections and deletes the legacy
 * `settings` collection, via the EmDash schema REST API. Safe to re-run:
 * existing collections/fields are skipped.
 *
 * Site identity (name, tagline, logo, social) lives in EmDash's native Site
 * Settings (admin -> Settings), not in a collection.
 *
 * Usage:
 *   EMDASH_EMAIL=you@example.com EMDASH_PASSWORD=secret \
 *   EMDASH_BASE=http://localhost:4321 node scripts/emdash-schema-setup.mjs
 *
 * For production, point EMDASH_BASE at the deployed Worker URL.
 */

const BASE = (process.env.EMDASH_BASE || 'http://localhost:4321').replace(/\/$/, '');
const EMAIL = process.env.EMDASH_EMAIL;
const PASSWORD = process.env.EMDASH_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error('Set EMDASH_EMAIL and EMDASH_PASSWORD env vars.');
  process.exit(1);
}

let cookie = '';

async function login() {
  const res = await fetch(`${BASE}/_emdash/api/auth/email-password/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    redirect: 'manual',
  });
  const setCookies = res.headers.getSetCookie?.() ?? [];
  const sess = setCookies.find((c) => c.startsWith('astro-session='));
  if (!sess) {
    const body = await res.text().catch(() => '');
    throw new Error(`Login failed (${res.status}); no astro-session cookie. ${body.slice(0, 200)}`);
  }
  cookie = sess.split(';')[0];
  console.log('Logged in.');
}

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      cookie,
      // EmDash CSRF guard: custom header + matching Origin on mutating requests.
      'X-EmDash-Request': '1',
      Origin: BASE,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, json };
}

async function listCollectionSlugs() {
  const { status, json } = await api('GET', '/_emdash/api/schema/collections');
  if (status !== 200) throw new Error(`List collections failed (${status}): ${JSON.stringify(json)}`);
  const items = json?.data?.items ?? json?.items ?? [];
  return new Set(items.map((c) => c.slug));
}

async function createCollection(def, existing) {
  if (existing.has(def.slug)) {
    console.log(`- collection "${def.slug}" already exists, skipping create`);
  } else {
    const { status, json } = await api('POST', '/_emdash/api/schema/collections', {
      slug: def.slug,
      label: def.label,
      labelSingular: def.labelSingular,
      supports: def.supports ?? [],
    });
    if (status !== 201 && status !== 200) {
      throw new Error(`Create "${def.slug}" failed (${status}): ${JSON.stringify(json)}`);
    }
    console.log(`+ created collection "${def.slug}"`);
  }

  // Fetch existing field slugs to stay idempotent.
  const fieldsRes = await api('GET', `/_emdash/api/schema/collections/${def.slug}/fields`);
  const existingFields = new Set(
    (fieldsRes.json?.data?.items ?? fieldsRes.json?.items ?? []).map((f) => f.slug),
  );

  let sortOrder = existingFields.size;
  for (const f of def.fields) {
    if (existingFields.has(f.slug)) {
      console.log(`  · field "${def.slug}.${f.slug}" exists, skipping`);
      continue;
    }
    const { status, json } = await api('POST', `/_emdash/api/schema/collections/${def.slug}/fields`, {
      slug: f.slug,
      label: f.label,
      type: f.type,
      required: f.required ?? false,
      sortOrder: sortOrder++,
    });
    if (status !== 201 && status !== 200) {
      throw new Error(`Create field "${def.slug}.${f.slug}" failed (${status}): ${JSON.stringify(json)}`);
    }
    console.log(`  + field "${def.slug}.${f.slug}" (${f.type})`);
  }
}

async function deleteCollection(slug, existing) {
  if (!existing.has(slug)) {
    console.log(`- collection "${slug}" not present, nothing to delete`);
    return;
  }
  const { status, json } = await api('DELETE', `/_emdash/api/schema/collections/${slug}?force=true`);
  if (status !== 200 && status !== 204) {
    throw new Error(`Delete "${slug}" failed (${status}): ${JSON.stringify(json)}`);
  }
  console.log(`x deleted collection "${slug}"`);
}

const HERO = {
  slug: 'hero',
  label: 'Hero',
  labelSingular: 'Slide',
  supports: [],
  fields: [
    { slug: 'image', label: 'Gambar', type: 'image' },
    { slug: 'title', label: 'Judul', type: 'string', required: true },
    { slug: 'subheading', label: 'Subjudul', type: 'text' },
    { slug: 'arabic', label: 'Teks Arab', type: 'string' },
    { slug: 'cta_label', label: 'Label Tombol', type: 'string' },
    { slug: 'cta_href', label: 'Link Tombol', type: 'string' },
    { slug: 'order', label: 'Urutan', type: 'number' },
  ],
};

const INFO_SITUS = {
  slug: 'info_situs',
  label: 'Info Situs',
  labelSingular: 'Info Situs',
  supports: [],
  fields: [
    { slug: 'address', label: 'Alamat', type: 'text' },
    { slug: 'whatsapp', label: 'WhatsApp', type: 'string' },
    { slug: 'email', label: 'Email', type: 'string' },
    { slug: 'tiktok', label: 'TikTok', type: 'string' },
    { slug: 'donation_bank_name', label: 'Donasi - Nama Bank', type: 'string' },
    { slug: 'donation_account_number', label: 'Donasi - No. Rekening', type: 'string' },
    { slug: 'donation_account_holder', label: 'Donasi - Atas Nama', type: 'string' },
    { slug: 'donation_note', label: 'Donasi - Catatan', type: 'text' },
    { slug: 'footer_text', label: 'Teks Footer', type: 'text' },
    { slug: 'hero_verse_arabic', label: 'Ayat Hero - Arab', type: 'string' },
    { slug: 'hero_verse_translation', label: 'Ayat Hero - Terjemahan', type: 'text' },
    { slug: 'hero_verse_reference', label: 'Ayat Hero - Referensi', type: 'string' },
  ],
};

(async () => {
  console.log(`EmDash schema setup -> ${BASE}`);
  await login();
  const existing = await listCollectionSlugs();
  console.log('Existing collections:', [...existing].join(', ') || '(none)');
  await createCollection(HERO, existing);
  await createCollection(INFO_SITUS, existing);
  await deleteCollection('settings', existing);
  console.log('Done.');
})().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
